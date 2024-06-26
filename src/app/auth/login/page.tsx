"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useEffect, useState } from "react";
import { signIn, googleSignUp } from "@/lib/auth"; // Assuming googleSignUp is exported from auth
import { useRouter } from "next/navigation";
import { UserNew } from "@/app/configure/preview/DesignPreview";
import { useQuery } from "@tanstack/react-query";
import { createUserIfNotExists } from "@/app/configure/preview/actions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const configurationId = localStorage.getItem("configurationId");
    if (configurationId) setConfigId(configurationId);
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      if (configId) {
        localStorage.removeItem("configurationId");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Failed to sign in");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const user = await googleSignUp();
      if (configId) {
        localStorage.removeItem("configurationId");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };



  return (
    <>
      <div className="bg-slate-50 min-h-[calc(100vh-3.5rem-1px)]">
        <MaxWidthWrapper className="pb-24 pt-10 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <main className="min-h-[40vh] flex flex-col justify-center">
            <h1 className="font-bold text-4xl mb-6 text-center"> Login</h1>
            <div className="flex flex-col gap-1 mx-auto ">
              <input
                placeholder="Email"
                className="w-64 py-1 px-2 rounded-md ring-1 ring-gray-400"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
              <input
                placeholder="Password"
                className="w-64 py-1 px-2 rounded-md ring-1 ring-gray-400"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleSignIn}
                  className="mt-2 bg-green-600 rounded-md w-48 text-white py-1.5 font-medium rounded-lg text-sm px-4"
                >
                  Sign In
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleGoogleSignUp}
                  className="-mt-3 text-white w-48 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-between mb-2"
                >
                  <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Sign In with Google
                </button>
              </div>
              <div className="text-center mt-2 text-red-500 font-semibold">
                {error && <p>{error}</p>}
              </div>
            </div>
          </main>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
