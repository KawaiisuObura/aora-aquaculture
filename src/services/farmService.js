// src/services/farmService.js
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Read every document of a collection, returning an empty list when the
 * collection does not exist yet or is not readable.
 * @param {string} name Collection name.
 * @returns {Promise<Object[]>}
 */
async function readCollection(name) {
  try {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  } catch {
    return [];
  }
}

/**
 * All ponds across the farm.
 * @returns {Promise<Object[]>}
 */
export function getAllPonds() {
  return readCollection("ponds");
}

/**
 * All harvest records across the farm.
 * @returns {Promise<Object[]>}
 */
export function getAllHarvests() {
  return readCollection("harvests");
}

/**
 * All financial transactions across the farm.
 * @returns {Promise<Object[]>}
 */
export function getAllTransactions() {
  return readCollection("transactions");
}

/**
 * Most recent activity log entries, newest first.
 * @param {number} count Maximum number of entries.
 * @returns {Promise<Object[]>}
 */
export async function getRecentActivity(count = 10) {
  try {
    const snapshot = await getDocs(
      query(collection(db, "activityLogs"), orderBy("createdAt", "desc"), limit(count))
    );
    return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  } catch {
    return [];
  }
}

/**
 * Sum the revenue transactions.
 * @param {Object[]} transactions Transaction documents.
 * @returns {number} Total revenue.
 */
export function sumRevenue(transactions) {
  return transactions
    .filter((entry) => entry.type === "revenue")
    .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
}

/**
 * Count harvests that have not been completed yet.
 * @param {Object[]} harvests Harvest documents.
 * @returns {number}
 */
export function countActiveHarvests(harvests) {
  return harvests.filter((entry) => entry.status !== "completed").length;
}
