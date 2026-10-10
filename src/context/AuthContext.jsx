import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, testConnection } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ initialMode: "signin", onDone: null });
  const [rulesNotice, setRulesNotice] = useState(false);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Immediate fallback profile so user is instantly ready and never blocked
        const defaultProfile = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "Student",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUserProfile(defaultProfile);

        // Sync with Firestore in background
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            await setDoc(userDocRef, defaultProfile, { merge: true });
          }
        } catch (err) {
          const errInfo = handleFirestoreError(err, "get", `users/${currentUser.uid}`);
          if (errInfo.isPermissionDenied) {
            setRulesNotice(true);
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (options = {}) => {
    setAuthModalConfig({
      initialMode: options.initialMode || "signin",
      onDone: options.onDone || null,
      message: options.message || "",
    });
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signInWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || cred.user.email?.split("@")[0] || "Student",
      lastLoginAt: new Date().toISOString(),
    };
    setUserProfile(profile);

    try {
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, profile, { merge: true });
    } catch (e) {
      const errInfo = handleFirestoreError(e, "update", `users/${cred.user.uid}`);
      if (errInfo.isPermissionDenied) setRulesNotice(true);
    }
    if (authModalConfig.onDone) authModalConfig.onDone(cred.user);
    closeAuthModal();
    return cred.user;
  };

  const signUpWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const profile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || cred.user.email?.split("@")[0] || "Student",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setUserProfile(profile);

    try {
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, profile, { merge: true });
    } catch (e) {
      const errInfo = handleFirestoreError(e, "create", `users/${cred.user.uid}`);
      if (errInfo.isPermissionDenied) setRulesNotice(true);
    }
    if (authModalConfig.onDone) authModalConfig.onDone(cred.user);
    closeAuthModal();
    return cred.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const profile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || cred.user.email?.split("@")[0] || "Student",
      lastLoginAt: new Date().toISOString(),
    };
    setUserProfile(profile);

    try {
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, profile, { merge: true });
    } catch (e) {
      const errInfo = handleFirestoreError(e, "update", `users/${cred.user.uid}`);
      if (errInfo.isPermissionDenied) setRulesNotice(true);
    }
    if (authModalConfig.onDone) authModalConfig.onDone(cred.user);
    closeAuthModal();
    return cred.user;
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        rulesNotice,
        setRulesNotice,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
