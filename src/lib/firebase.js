import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBS8oCh1gZ62x1WCikxdhZ_iqdsodMi-Go",
  authDomain: "pennywise-1c182.firebaseapp.com",
  projectId: "pennywise-1c182",
  storageBucket: "pennywise-1c182.firebasestorage.app",
  messagingSenderId: "30356818873",
  appId: "1:30356818873:web:066af8c43977e55c850468"
};

export const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`;

export function handleFirestoreError(error, operationType, path) {
  const isPermission =
    error?.code === "permission-denied" ||
    (error instanceof Error && error.message.includes("Missing or insufficient permissions"));

  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    isPermissionDenied: isPermission,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
    },
  };

  if (isPermission) {
    console.warn("Firestore Permission Notice: Remote rules in Firebase Console require update for:", path);
  } else {
    console.error("Firestore Error:", JSON.stringify(errInfo));
  }
  return errInfo;
}

// Lightweight probe to verify connection status
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client is currently offline or connecting.");
    }
  }
}
