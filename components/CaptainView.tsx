"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import getInitials from "@/lib/getInitials";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import socket from "@/lib/socket";
import { useSession } from "next-auth/react";

interface Ride {
  rider: {
    _id: string;
    name: string;
    phoneNumber: string;
    rating: number;
  };
  pickupLocation: {
    address: string;
  };
  dropLocation: {
    address: string;
  };
  distance: number;
  fare: number;
  status: string;
}

function CaptainView() {
  const session = useSession();
  const { rideId } = useParams();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    const getRideDetails = async () => {
      const response = await fetch(`/api/ride/${rideId}`);
      const data = await response.json();

      if (response.ok) {
        setRide(data.ride);
        toast.success(data.message, {
          position: "top-center",
          style: { background: "#418B24" },
        });
      } else {
        toast.error(data.message, {
          position: "top-center",
          style: { background: "#D50419" },
        });
      }
    };
    if (rideId) getRideDetails();
  }, [rideId]);

  if (!ride) return <p>Loading...</p>;

  const { rider, pickupLocation, dropLocation, distance, fare, status } = ride;

  const handleCaptainArrived = async () => {
    const response = await fetch(`/api/ride/${rideId}/arrived`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rideId,
      }),
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
      socket.emit("captain-arrived", {
        captainId: session.data?.user.id,
        riderId: ride.rider._id,
      });
    }
    setRide((prev) => (prev ? { ...prev, status: "arrived" } : prev));
  };

  const handleStartRide = async () => {
    const response = await fetch(`/api/ride/${rideId}/start`, {
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
      socket.emit("ride-started", {
        captainId: session.data?.user.id,
        riderId: ride.rider._id,
      });
    }
    setRide((prev) => (prev ? { ...prev, status: "ongoing" } : prev));
  };

  const handleRideCompleted = async () => {
    const response = await fetch(`/api/ride/${rideId}/end`, {
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
      socket.emit("ride-completed", {
        captainId: session.data?.user.id,
        riderId: ride.rider._id,
      });
      setRide((prev) => (prev ? { ...prev, status: "completed" } : prev));
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-primary">Rider</span> Details
        </h1>
      </div>

      <div>
        <Card className="relative mx-auto w-full max-w-sm pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <div className="relative z-20 aspect-video w-full bg-black flex items-center justify-center text-white">
            Map View
          </div>

          <CardHeader>
            <span className="flex items-center justify-center">
              {ride.status === "accepted" && (
                <h1 className="text-md font-semibold">
                  Going to pickup • {distance}km away
                </h1>
              )}
              {ride.status === "arrived" && (
                <h1 className="text-md font-semibold">Waiting for Rider</h1>
              )}
              {ride.status === "ongoing" && (
                <h1 className="text-md font-semibold">Trip Ongoing</h1>
              )}
              {ride.status === "completed" && (
                <h1 className="text-md font-semibold">
                  Collect fare from rider
                </h1>
              )}
            </span>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-nowrap">
                <CardTitle className="text-xl">{rider?.name}</CardTitle>
              </div>

              <Avatar>
                <AvatarFallback className="bg-blue-500 text-white">
                  {getInitials(rider?.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center justify-center">
              <CardTitle className="text-md">📞 {rider?.phoneNumber}</CardTitle>
            </div>

            <CardDescription className="pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-semibold text-md">
                    📍 Pickup
                  </CardTitle>
                  <CardTitle className="font-semibold text-md text-right">
                    {pickupLocation?.address}
                  </CardTitle>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-semibold text-md">
                    🏁 Drop
                  </CardTitle>
                  <CardTitle className="font-semibold text-md text-right">
                    {dropLocation?.address}
                  </CardTitle>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-semibold text-md">
                    📏 Distance
                  </CardTitle>
                  <CardTitle className="font-semibold text-md">
                    {distance} km
                  </CardTitle>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-semibold text-md">
                    💰 Fare
                  </CardTitle>
                  <CardTitle className="font-semibold text-md">
                    ₹{fare}
                  </CardTitle>
                </div>
              </div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-between">
            {status === "accepted" && (
              <Button
                onClick={handleCaptainArrived}
                className="hover:cursor-pointer w-full bg-primary text-black"
              >
                Arrived
              </Button>
            )}

            {status === "arrived" && (
              <Button
                onClick={handleStartRide}
                className="hover:cursor-pointer w-full bg-primary text-black"
              >
                Start Ride
              </Button>
            )}

            {status === "ongoing" && (
              <Button
                onClick={handleRideCompleted}
                className="hover:cursor-pointer w-full bg-primary text-black"
              >
                Finish Ride
              </Button>
            )}
            {status === "completed" && (
              <h1>Payment collection logic goes here</h1>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CaptainView;
