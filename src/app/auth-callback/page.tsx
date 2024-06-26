"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createUserIfNotExists } from "../configure/preview/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import type { UserNew } from "../configure/preview/DesignPreview";

const Page = () => {
  const [configId, setConfigId] = useState<string | null>(null);
  const { user } = useAuth();
  const [newUser, setNewUser] = useState<UserNew | null>(null);
  const router = useRouter();

  useEffect(() => {
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) setConfigId(configurationId);
  }, []);

  useEffect(() => {
    if (user) {
      setNewUser({
        uid: user.uid,
        email: user.email ?? "",
      });
    }
  }, [user]);

  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await createUserIfNotExists(newUser),
    retry: true,
    retryDelay: 1000,
  });

  if (data?.success) {
    if (configId) {
      localStorage.removeItem("configurationId");
      router.push(`/configure/preview?id=${configId}`);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
