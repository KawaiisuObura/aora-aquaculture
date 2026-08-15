// src/services/userService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const USERS_COLLECTION = "users";

/**
 * Create (or overwrite) the Firestore profile document for a user.
 * @param {import("firebase/auth").User} user Authenticated Firebase user.
 * @param {{ role?: string, displayName?: string, farmId?: string }} extra Additional profile fields.
 * @returns {Promise<Object>} The stored profile.
 */
export async function createUserProfile(user, extra = {}) {
  const profile = {
    uid: user.uid,
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    displayName: extra.displayName || user.displayName || "",
    role: extra.role || "farmer",
    farmId: extra.farmId || user.uid,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, USERS_COLLECTION, user.uid), profile, { merge: true });
  return profile;
}

/**
 * Fetch a single user profile.
 * @param {string} uid Firebase Auth UID.
 * @returns {Promise<Object|null>} Profile or null when it does not exist.
 */
export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

/**
 * Fetch every registered user. Requires an admin caller under Firestore rules.
 * @returns {Promise<Object[]>} All user profiles.
 */
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

/**
 * Change a user's role.
 * @param {string} uid User to update.
 * @param {"admin"|"farmer"} role New role.
 */
export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Remove a user's Firestore profile. The Firebase Auth account itself can only
 * be removed from a privileged environment (Admin SDK / Cloud Function).
 * @param {string} uid User to delete.
 */
export async function deleteUser(uid) {
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}
