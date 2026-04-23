"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import getInitials from "@/lib/getInitials";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import socket from "@/lib/socket";

interface Ride {
  status: string;
  fare: number;
  otp: string;
  captain: {
    _id: string;
    name: string;
    phoneNumber: string;
    rating: number;
    vehicle?: {
      vehicleNumber: string;
      vehicleModel: string;
      vehicleBrand: string;
      vehicleColor: string;
      vehicleType: string;
    };
  };
}

function RiderView() {
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

  useEffect(() => {
    const handler = ({ captainId }: { captainId: string }) => {
      console.log("Captain arrived", captainId);
      setRide((prev) => (prev ? { ...prev, status: "arrived" } : prev));
      toast.success("Captain arrived at your location", {
        position: "top-center",
        style: { background: "#418B24" },
      });
    };

    const startHandler = ({ captainId }: { captainId: string }) => {
      console.log("Ride started by Captain", captainId);
      setRide((prev) => (prev ? { ...prev, status: "ongoing" } : prev));
      toast.success("Ride started by Captain", {
        position: "top-center",
        style: { background: "#418B24" },
      });
    };

    const endHandler = ({ captainId }: { captainId: string }) => {
      console.log("Reached at destination", captainId);
      setRide((prev) => (prev ? { ...prev, status: "completed" } : prev));
      toast.success("Ride Completed succesfully", {
        position: "top-center",
        style: { background: "#418B24" },
      });
    };

    socket.on("captain-arrived", handler);
    socket.on("ride-started", startHandler);
    socket.on("ride-completed", endHandler);

    return () => {
      socket.off("captain-arrived", handler);
      socket.off("ride-started", startHandler);
      socket.off("ride-completed", endHandler);
    };
  }, []);

  if (!ride) return <p>Loading...</p>;

  const { captain, fare, otp } = ride;
  const { vehicle } = captain;

  return (
    <div className="p-10 min-h-screen">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-primary">Captain</span> Details
        </h1>
      </div>
      <div>
        <Card className="relative mx-auto w-full max-w-sm pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <Image
            width={20}
            height={30}
            src=""
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
          <CardHeader>
            <span className="flex items-center justify-center">
              {ride.status === "accepted" && (
                <h1 className="text-md font-semibold">Captain is on the way</h1>
              )}
              {ride.status === "arrived" && (
                <h1 className="text-md font-semibold">
                  Captain arrived at your location
                </h1>
              )}
              {ride.status === "ongoing" && (
                <h1 className="text-md font-semibold">
                  Heading towards destination
                </h1>
              )}
              {ride.status === "completed" && (
                <h1 className="text-md font-semibold">Ride Completed</h1>
              )}
            </span>
            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-nowrap">
                <CardTitle className="text-xl">{captain?.name}</CardTitle>
              </div>

              <span>
                <Avatar>
                  <AvatarFallback className="bg-red-500 text-white">
                    {getInitials(captain?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </span>
            </div>

            <div className="flex items-center justify-center">
              <CardTitle className="text-md">
                📞 {captain?.phoneNumber}
              </CardTitle>
            </div>

            <CardDescription className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-semibold text-md">
                    {vehicle?.vehicleNumber}
                  </CardTitle>
                  <CardTitle className="font-semibold text-md">
                    {vehicle?.vehicleBrand} {vehicle?.vehicleModel}
                  </CardTitle>
                </div>
                <div>
                  <CardTitle className="font-semibold text-md">
                    {vehicle?.vehicleColor}
                  </CardTitle>
                  <CardTitle>
                    Capacity: {vehicle?.vehicleType === "two_wheeler" ? 2 : 4}
                  </CardTitle>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-center">
            {ride.status === "completed" && (
              <CardTitle className="text-md">
                Please pay ₹{fare} to Captain
              </CardTitle>
            )}
            {["accepted", "arrived"].includes(ride.status) && (
              <CardTitle className="text-md">
                OTP - <span className="text-primary">{otp}</span>
              </CardTitle>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RiderView;
