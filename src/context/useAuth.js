// src/context/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./authContext";

/**
 * Access the auth context.
 * @returns {{ user: Object|null, userProfile: Object|null, loading: boolean, role: string, isAdmin: boolean }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
