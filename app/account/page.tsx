"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import getIntials from "@/lib/getInitials";
import CaptainAccount from "@/components/CaptainAccount";
import RiderAccount from "@/components/RiderAccount";

export default function AccountsPage() {
  const session = useSession();
  const [accountData, setAccountData] = useState<any>(null);

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
