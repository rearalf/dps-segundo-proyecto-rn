import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { auth } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

function useSignIn() {
  const router = useRouter();
  const setSessionFromFirebaseUser = useAuthSessionStore(
    (state) => state.setSessionFromFirebaseUser,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError("El correo no es valido");
        return;
      }

      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/dashboard");
    } catch (err: any) {
      let errorMessage = "Ocurrió un error inesperado.";

      switch (err.code) {
        case "auth/invalid-credential":
          errorMessage = "El correo o la contraseña son incorrectos.";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo.";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta.";
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
    const subscriber = onAuthStateChanged(auth, (firebaseUser) => {
      setSessionFromFirebaseUser(firebaseUser);
      if (firebaseUser) router.replace("/dashboard");
    });
    return subscriber;
  }, [setSessionFromFirebaseUser, router]);

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
