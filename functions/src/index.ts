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