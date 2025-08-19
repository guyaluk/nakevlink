import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUserWithRole = functions.auth.user().onCreate(async (user) => {
  try {
    console.log("User created:", user.uid, user.email);
    
    // Set default role as customer
    await admin.auth().setCustomUserClaims(user.uid, {
      role: "customer"
    });
    
    console.log("Custom claims set for user:", user.uid);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
});

export const setUserRole = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to set role"
    );
  }

  const { uid, role } = data;
  
  // Validate role
  if (!["customer", "business_owner"].includes(role)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Role must be 'customer' or 'business_owner'"
    );
  }

  try {
    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });
    
    console.log(`Role '${role}' set for user ${uid}`);
    
    return { success: true, message: `Role '${role}' set successfully` };
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to set user role"
    );
  }
});

export const updateUserProfile = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { displayName, role, userData } = data;
  const uid = context.auth.uid;

  try {
    // Update Firebase Auth profile
    if (displayName) {
      await admin.auth().updateUser(uid, {
        displayName: displayName
      });
    }

    // Set custom claims with role
    if (role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }

    console.log(`Profile updated for user ${uid}:`, { displayName, role, userData });
    
    return { 
      success: true, 
      message: "Profile updated successfully",
      uid: uid
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to update profile"
    );
  }
});

// Generate secure 6-digit punch code
export const generatePunchCode = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { cardId } = data;
  const userId = context.auth.uid;

  if (!cardId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "cardId is required"
    );
  }

  try {
    const db = admin.firestore();
    
    // Verify the punch card belongs to the user
    const cardDoc = await db.collection('punchCards').doc(cardId).get();
    if (!cardDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Punch card not found"
      );
    }

    const cardData = cardDoc.data();
    if (cardData?.user_id !== userId) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You don't own this punch card"
      );
    }

    // Check for existing active code (rate limiting)
    const activeCodesQuery = await db.collection('punchCodes')
      .where('card_id', '==', cardId)
      .where('used', '==', false)
      .where('expires_at', '>', admin.firestore.Timestamp.now())
      .get();

    if (!activeCodesQuery.empty) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "A code is already active for this card"
      );
    }

    // Generate unique 6-digit code
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const existingCodeQuery = await db.collection('punchCodes')
        .where('code', '==', code)
        .where('used', '==', false)
        .where('expires_at', '>', admin.firestore.Timestamp.now())
        .get();
      
      isUnique = existingCodeQuery.empty;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      throw new functions.https.HttpsError(
        "internal",
        "Failed to generate unique code"
      );
    }

    // Create punch code with 2-minute expiry
    const now = admin.firestore.Timestamp.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + (2 * 60 * 1000));

    const punchCodeData = {
      code: code!,
      card_id: cardId,
      user_id: userId,
      business_id: cardData?.business_id,
      created_at: now,
      expires_at: expiresAt,
      used: false
    };

    await db.collection('punchCodes').add(punchCodeData);

    console.log(`Punch code generated for user ${userId}, card ${cardId}`);

    return {
      success: true,
      code: code!,
      expires_at: expiresAt.toMillis()
    };
  } catch (error) {
    console.error("Error generating punch code:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate punch code"
    );
  }
});

// Validate punch code and create punch
export const validateAndPunch = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { code } = data;

  if (!code) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Code is required"
    );
  }

  try {
    const db = admin.firestore();
    
    // Find the punch code
    const punchCodeQuery = await db.collection('punchCodes')
      .where('code', '==', code)
      .where('used', '==', false)
      .get();

    if (punchCodeQuery.empty) {
      throw new functions.https.HttpsError(
        "not-found",
        "Invalid or already used code"
      );
    }

    const punchCodeDoc = punchCodeQuery.docs[0];
    const punchCodeData = punchCodeDoc.data();

    // Check if code is expired
    if (punchCodeData.expires_at.toMillis() < Date.now()) {
      throw new functions.https.HttpsError(
        "deadline-exceeded",
        "Code has expired"
      );
    }

    // Verify business owns this punch card
    const businessQuery = await db.collection('businesses')
      .where('email', '==', context.auth?.token.email)
      .get();

    if (businessQuery.empty) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Business not found"
      );
    }

    const businessDoc = businessQuery.docs[0];
    if (businessDoc.id !== punchCodeData.business_id) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "This code is not for your business"
      );
    }

    // Get punch card to check current punches
    const cardDoc = await db.collection('punchCards').doc(punchCodeData.card_id).get();
    if (!cardDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Punch card not found"
      );
    }

    const cardData = cardDoc.data();
    
    // Count existing punches
    const punchesQuery = await db.collection('punches')
      .where('card_id', '==', parseInt(punchCodeData.card_id))
      .get();

    const currentPunches = punchesQuery.size;
    
    if (currentPunches >= cardData?.max_punches) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Punch card is already complete"
      );
    }

    // Create the punch
    await db.collection('punches').add({
      card_id: parseInt(punchCodeData.card_id),
      punch_time: admin.firestore.Timestamp.now()
    });

    // Mark code as used
    await punchCodeDoc.ref.update({
      used: true,
      used_at: admin.firestore.Timestamp.now()
    });

    const newPunchCount = currentPunches + 1;
    const isComplete = newPunchCount >= cardData?.max_punches;

    console.log(`Punch validated for card ${punchCodeData.card_id}, punches: ${newPunchCount}/${cardData?.max_punches}`);

    return {
      success: true,
      message: "Punch recorded successfully",
      punches: newPunchCount,
      maxPunches: cardData?.max_punches,
      isComplete: isComplete
    };
  } catch (error) {
    console.error("Error validating punch code:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Failed to validate punch code"
    );
  }
});