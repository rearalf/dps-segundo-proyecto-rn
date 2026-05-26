import { auth, db } from "@/services/firebase";
import useAuthSessionStore from "@/store/useAuthSessionStore";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";

export function useSignUp() {
  const router = useRouter();
  const setSessionUser = useAuthSessionStore((state) => state.setSessionUser);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 1,
        createdAt: serverTimestamp(),
      });

      setSessionUser({
        uid: user.uid,
        email: user.email ?? email.trim(),
        displayName: name.trim(),
        role: 2,
      });

      router.replace("/(tabs)" as never);
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      Alert.alert(
        "Error de registro",
        error.message || "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSignUp,
  };
}
