import { Redirect } from "expo-router";

import useAuthSessionStore from "@/store/useAuthSessionStore";

export default function Index() {
  const isHydrated = useAuthSessionStore((state) => state.isHydrated);
  const user = useAuthSessionStore((state) => state.user);

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={user ? ("/(tabs)" as never) : "/signin"} />;
}
