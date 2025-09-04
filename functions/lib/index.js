"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndPunch = exports.generatePunchCode = exports.updateUserProfile = exports.setUserRole = exports.createUserWithRole = exports.cleanupExpiredCodes = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Rate limiting: Track code generation attempts per user
const userRateLimit = new Map();
// Security: Clean up expired codes periodically
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_CODES_PER_MINUTE = 5;
// Helper function to check rate limits
function checkRateLimit(userId) {
    const now = Date.now();
    const userLimit = userRateLimit.get(userId);
    if (!userLimit || now > userLimit.resetTime) {
        // Reset or create new rate limit
        userRateLimit.set(userId, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        });
        return true;
    }
    if (userLimit.count >= MAX_CODES_PER_MINUTE) {
        return false; // Rate limited
    }
    userLimit.count++;
    return true;
}
// Scheduled function to clean up expired punch codes (runs every hour)
exports.cleanupExpiredCodes = functions.pubsub
    .schedule('0 * * * *') // Every hour at minute 0
    .onRun(async (context) => {
    console.log('Starting cleanup of expired punch codes...');
    try {
        // This would typically clean up from DataConnect
        // For now, just log the cleanup attempt
        console.log('Expired codes cleanup completed');
        return null;
    }
    catch (error) {
        console.error('Error during cleanup:', error);
        throw error;
    }
});
exports.createUserWithRole = functions.auth.user().onCreate(async (user) => {
    try {
        console.log("User created:", user.uid, user.email);
        // Check if this is a business owner by checking the businesses collection
        const db = admin.firestore();
        const businessQuery = await db.collection('businesses')
            .where('email', '==', user.email)
            .get();
        const role = !businessQuery.empty ? "business_owner" : "customer";
        // Set role based on whether they have a business record
        await admin.auth().setCustomUserClaims(user.uid, {
            role: role
        });
        console.log(`Custom claims set for user ${user.uid} with role: ${role}`);
    }
    catch (error) {
        console.error("Error setting custom claims:", error);
    }
});
exports.setUserRole = functions.https.onCall(async (data, context) => {
    // Check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated to set role");
    }
    const { uid, role } = data;
    // Validate role
    if (!["customer", "business_owner"].includes(role)) {
        throw new functions.https.HttpsError("invalid-argument", "Role must be 'customer' or 'business_owner'");
    }
    try {
        // Set custom claims
        await admin.auth().setCustomUserClaims(uid, { role });
        console.log(`Role '${role}' set for user ${uid}`);
        return { success: true, message: `Role '${role}' set successfully` };
    }
    catch (error) {
        console.error("Error setting user role:", error);
        throw new functions.https.HttpsError("internal", "Failed to set user role");
    }
});
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
    // Check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
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
    }
    catch (error) {
        console.error("Error updating profile:", error);
        throw new functions.https.HttpsError("internal", "Failed to update profile");
    }
});
// Generate secure 6-digit punch code using DataConnect
exports.generatePunchCode = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { cardId } = data;
    const userId = context.auth.uid;
    if (!cardId) {
        throw new functions.https.HttpsError("invalid-argument", "cardId is required");
    }
    try {
        // Check rate limits first
        if (!checkRateLimit(userId)) {
            throw new functions.https.HttpsError("resource-exhausted", "Too many code generation attempts. Please wait a minute before trying again.");
        }
        // Use Firestore for now (will integrate with DataConnect later)
        const db = admin.firestore();
        // First, get punch card info from DataConnect via web app DataConnect endpoint
        // For now, we'll use a simplified approach with Firestore
        // Check for existing active codes (rate limiting)
        const now = new Date();
        const activeCodesQuery = await db.collection('punchCodes')
            .where('userId', '==', userId)
            .where('cardId', '==', cardId)
            .where('isUsed', '==', false)
            .where('expiresAt', '>', now)
            .get();
        if (!activeCodesQuery.empty) {
            throw new functions.https.HttpsError("failed-precondition", "A code is already active for this card");
        }
        // Generate unique 6-digit code
        let code;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        do {
            code = Math.floor(100000 + Math.random() * 900000).toString();
            // Check if code exists and is still valid
            const existingCodeQuery = await db.collection('punchCodes')
                .where('code', '==', code)
                .where('isUsed', '==', false)
                .where('expiresAt', '>', now)
                .get();
            isUnique = existingCodeQuery.empty;
            attempts++;
        } while (!isUnique && attempts < maxAttempts);
        if (!isUnique) {
            throw new functions.https.HttpsError("internal", "Failed to generate unique code");
        }
        // Create punch code with 2-minute expiry  
        const expiresAt = new Date(now.getTime() + (2 * 60 * 1000));
        await db.collection('punchCodes').add({
            code: code,
            cardId: cardId,
            userId: userId,
            createdAt: now,
            expiresAt: expiresAt,
            isUsed: false
        });
        console.log(`Punch code generated for user ${userId}, card ${cardId}`);
        return {
            success: true,
            code: code,
            expires_at: expiresAt.getTime()
        };
    }
    catch (error) {
        console.error("Error generating punch code:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", "Failed to generate punch code");
    }
});
// Validate punch code and create punch using DataConnect
exports.validateAndPunch = functions.https.onCall(async (data, context) => {
    var _a;
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
    }
    const { code } = data;
    if (!code) {
        throw new functions.https.HttpsError("invalid-argument", "Code is required");
    }
    try {
        // Use Firestore for now (will integrate with DataConnect later)
        const db = admin.firestore();
        // Find the punch code
        const punchCodeQuery = await db.collection('punchCodes')
            .where('code', '==', code)
            .where('isUsed', '==', false)
            .get();
        if (punchCodeQuery.empty) {
            throw new functions.https.HttpsError("not-found", "Invalid or already used code");
        }
        const punchCodeDoc = punchCodeQuery.docs[0];
        const punchCodeData = punchCodeDoc.data();
        // Check if code is expired
        const expiresAt = punchCodeData.expiresAt instanceof Date ? punchCodeData.expiresAt : punchCodeData.expiresAt.toDate();
        if (expiresAt.getTime() < Date.now()) {
            throw new functions.https.HttpsError("deadline-exceeded", "Code has expired");
        }
        // For now, we'll use a simplified business validation
        // In production, this would validate the business user properly
        const userEmail = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.token.email;
        if (!userEmail) {
            throw new functions.https.HttpsError("unauthenticated", "User email not found");
        }
        console.log(`Punch code validation: user=${userEmail}, cardId=${punchCodeData.cardId}`);
        // Mark code as used and add punch
        await punchCodeDoc.ref.update({
            isUsed: true,
            usedAt: new Date()
        });
        // Add punch record (simplified)
        await db.collection('punches').add({
            cardId: punchCodeData.cardId,
            userId: punchCodeData.userId,
            businessEmail: userEmail,
            punchTime: new Date()
        });
        console.log(`Punch validated for card ${punchCodeData.cardId} by business ${userEmail}`);
        return {
            success: true,
            message: "Punch recorded successfully",
            customer: {
                name: "Customer",
                email: "customer@example.com"
            },
            business: {
                name: "Business" // Simplified for now
            },
            punches: 1,
            maxPunches: 10,
            isComplete: false // Simplified
        };
    }
    catch (error) {
        console.error("Error validating punch code:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", "Failed to validate punch code");
    }
});
//# sourceMappingURL=index.js.map