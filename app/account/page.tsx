"use client";
import { useSession } from "next-auth/react";
import CaptainAccount from "@/components/CaptainAccount";
import RiderAccount from "@/components/RiderAccount";

export default function AccountsPage() {
  const session = useSession();

  return (
    <div>
      {session.data?.user.role === "captain" ? (
        <CaptainAccount />
      ) : (
        <RiderAccount />
      )}
    </div>
  );
}
