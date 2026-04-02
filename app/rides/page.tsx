"use client";
import React from "react";
import { useSession } from "next-auth/react";
import CaptainRides from "@/components/CaptainRides";
import RiderRides from "@/components/RiderRides";

function Rides() {
  const session = useSession();
  return (
    <div>
      {session.data?.user.role === "captain" ? (
        <CaptainRides />
      ) : (
        <RiderRides />
      )}
    </div>
  );
}

export default Rides;
