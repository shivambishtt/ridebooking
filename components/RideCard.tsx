"use client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getInitials from "@/lib/getInitials";
import { Ride } from "./CaptainRides";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import socket from "@/lib/socket";

function RideCard({ rides }: { rides: Ride[] }) {
  const router = useRouter();
  const handleRideAccept = async (rideId: string) => {
    try {
      const response = await fetch(`/api/ride/${rideId}/accept`, {
        method: "PATCH",
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message, {
          position: "top-center",
          style: {
            background: "#D50419",
          },
        });
      } else {
        toast.success(data.message, {
          position: "top-center",
          style: {
            background: "#418B24",
          },
        });
        router.push(`ride/${rideId}`);
      }
    } catch (error) {
      console.log("ERROR:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    socket.on("ride-accepted", ({ rideId }) => {
      router.push(`/ride/${rideId}`);
    });
    return () => {
      socket.off("ride-accepted");
    };
  });

  return (
    <div className="max-w-sm w-full relative">
      {rides.map((ride, index) => {
        return (
          <Card
            key={index}
            className="w-full mt-4 rounded-2xl shadow-lg border border-gray-100"
          >
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Avatar>
                <AvatarImage alt="TS" className="grayscale" />
                <AvatarFallback>{getInitials(ride.rider)}</AvatarFallback>
              </Avatar>

              <div className="flex items-center justify-between flex-1">
                <CardTitle className="text-lg font-semibold">
                  {ride.rider}
                </CardTitle>
                <span className="font-semibold text-primary">₹{ride.fare}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center text-center gap-2">
                <span className="font-semibold">From</span>
                <span className="text-nowrap">
                  {ride.pickupLocation.address}
                </span>
              </div>
              <div className="flex items-center text-center gap-2">
                <span className="font-semibold">To</span>
                <span>{ride.dropLocation.address}</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRideAccept(ride.rideId)}
                  className="w-full bg-primary"
                >
                  Accept
                </Button>
                <Button className="w-full">Reject</Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default RideCard;
