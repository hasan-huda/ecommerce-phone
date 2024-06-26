import { useState, useEffect } from "react";
import { authStateListener } from "./auth";
import { User } from "firebase/auth";

export const useAuth = () => {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      setUser(user);
      if (user && adminEmail) {
        setIsAdmin(adminEmail === user.email);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [adminEmail]);

  return { user, isAdmin };
};
