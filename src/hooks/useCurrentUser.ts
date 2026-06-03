// hooks/useCurrentUser.ts

import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  return user;
}