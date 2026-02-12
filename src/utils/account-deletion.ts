/**
 * Account deletion utilities
 * Handles 30-day grace period deletion flow:
 * - User requests deletion → sets deletionScheduledAt timestamp → signs out
 * - User logs back in within 30 days → silently clears timestamp (restored)
 * - User logs back in after 30 days → hard deletes Firestore doc + Firebase Auth account
 * - User never returns → Cloud Function cleanup (future)
 */

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const DELETION_GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in miliseconds

/** Reference to a user's document */
function userDoc(uid: string): FirebaseFirestoreTypes.DocumentReference {
  return firestore().collection('users').doc(uid);
}

/**
 * Check if user has a pending deletion.
 * - If >30 days: hard delete Firestore doc, return true (caller should delete Auth account)
 * - If <30 days: silently clear the timestamp, return false
 * - If no deletion scheduled: return false
 */
export async function checkAndExecuteDeletion(uid: string): Promise<boolean> {
  try {
    const doc = await userDoc(uid).get();
    if (!doc.exists) return false;

    const data = doc.data();
    const scheduledAt = data?.deletionScheduledAt as number | undefined;
    if (!scheduledAt) return false;

    if (Date.now() - scheduledAt >= DELETION_GRACE_PERIOD_MS) {
      await userDoc(uid).delete();
      return true;
    }

    // Within grace period — cancel deletion silently
    await userDoc(uid).update({ deletionScheduledAt: firestore.FieldValue.delete() });
    return false;
  } catch (error) {
    console.error('checkAndExecuteDeletion:', error);
    return false;
  }
}

/** Schedule account deletion (sets timestamp, does not delete yet) */
export async function scheduleDeletion(uid: string): Promise<void> {
  await userDoc(uid).set({ deletionScheduledAt: Date.now() }, { merge: true });
}
