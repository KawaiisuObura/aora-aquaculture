// src/context/AuthContext.jsx
import { useEffect, useMemo, useState } from "react";
import { auth, onAuthStateChanged } from "../firebase/firebase";
import { getUserProfile } from "../services/userService";
import { AuthContext } from "./authContext";

/**
 * Provides the authenticated user, their Firestore profile and role helpers.
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setUserProfile(await getUserProfile(currentUser.uid));
      } catch {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      role: userProfile?.role || "farmer",
      isAdmin: userProfile?.role === "admin",
    }),
    [user, userProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
