"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "@/components/shared/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return (
      <div className="absolute z-[9999] w-screen h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (status == "unauthenticated") {
    router.push("/signin");
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }
};

export default AuthGuard;
