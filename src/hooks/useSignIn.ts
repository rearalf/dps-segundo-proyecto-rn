import { useRouter } from "expo-router";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { auth, db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";

function useSignIn() {
  const router = useRouter();
  const setSessionUser = useAuthSessionStore((state) => state.setSessionUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function syncUserSession(firebaseUser: any) {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let role = null;
      let displayName = firebaseUser.displayName || "";

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        role = userData.role;
        if (userData.name) displayName = userData.name;
      }

      setSessionUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || email.trim(),
        displayName: displayName,
        role: role,
      });

      return true;
    } catch (e) {
      console.error("Error sincronizando los datos de Firestore:", e);
      return false;
    }
  }

  async function handleSignIn() {
    try {
      setLoading(true);
      setError(null);

      if (!email.trim() || !password) {
        setError("Debe de llenar todos los campos");
        return;
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email.trim())) {
        setError("El correo no es válido");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await syncUserSession(userCredential.user);

      router.replace("/(tabs)" as never);
    } catch (err: any) {
      let errorMessage = "Ocurrió un error inesperado.";

      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "El correo o la contraseña son incorrectos.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Demasiados intentos fallidos. Intenta más tarde.";
          break;
        default:
          errorMessage = err.message || "No se pudo iniciar sesión.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        const success = await syncUserSession(firebaseUser);
        setLoading(false);

        if (success) {
          router.replace("/(tabs)" as never);
        }
      }
    });
    return subscriber;
  }, [router]);

  return {
    error,
    email,
    loading,
    password,
    setEmail,
    setPassword,
    handleSignIn,
  };
}

export default useSignIn;
