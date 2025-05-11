"use client";

import { UserRole } from "@/types/UserTypes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "@/components/shared/Loader";

const DashboardGuard = ({ children }: { children: React.ReactNode }) => {
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return (
      <div className="absolute z-[9999] w-screen h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (status == "unauthenticated" || session?.user.userRole != UserRole.ADMIN) {
    console.log("unauthenticated or user role");
    router.push("/signin");
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }
};

export default DashboardGuard;
