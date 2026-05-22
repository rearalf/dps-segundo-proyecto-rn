import { User } from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

type SessionUser = {
  uid: string;
  email: string;
  displayName: string;
};

type AuthSessionState = {
  user: SessionUser | null;
  isHydrated: boolean;
  setHydrated: (isHydrated: boolean) => void;
  setSessionUser: (user: SessionUser | null) => void;
  setSessionFromFirebaseUser: (user: User | null) => void;
  clearSession: () => void;
};

const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email ?? "",
  displayName: user.displayName ?? "",
});

const createMemoryStorage = (): StateStorage => {
  const memoryStorage: Record<string, string> = {};

  return {
    getItem: async (name) => memoryStorage[name] ?? null,
    setItem: async (name, value) => {
      memoryStorage[name] = value;
    },
    removeItem: async (name) => {
      delete memoryStorage[name];
    },
  };
};

const resolveStorage = (): StateStorage => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maybeAsyncStorage =
      require("@react-native-async-storage/async-storage").default;

    if (maybeAsyncStorage && typeof maybeAsyncStorage.getItem === "function") {
      return maybeAsyncStorage as StateStorage;
    }
  } catch {
    // Fall back to in-memory storage when native module is unavailable.
  }

  return createMemoryStorage();
};

const appStorage = resolveStorage();

const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      setHydrated: (isHydrated) => set({ isHydrated }),
      setSessionUser: (user) => set({ user }),
      setSessionFromFirebaseUser: (user) =>
        set({ user: user ? toSessionUser(user) : null }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export default useAuthSessionStore;
