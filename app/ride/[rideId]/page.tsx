"use client";
import CaptainView from "@/components/CaptainView";
import RiderView from "@/components/RiderView";
import { useSession } from "next-auth/react";

function RideUI({ params }: { params: { rideId: string } }) {
  const session = useSession();
  return (
    <div>
      {session.data?.user.role === "captain" ? <CaptainView /> : <RiderView />}
    </div>
  );
}

export default RideUI;
