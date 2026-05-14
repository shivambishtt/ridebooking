"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Navigation, IndianRupee, Clock3 } from "lucide-react";

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
        router.push(`/ride/${rideId}`);
      }
    } catch (error) {
      console.log(error);
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
  }, [router]);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl">
        {rides.map((ride, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-95"
          >
            <div className="h-2 w-full bg-linear-to-r from-primary via-primary/70 to-primary" />

            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage alt="Rider" />

                    <AvatarFallback className="text-lg font-bold bg-primary text-white">
                      {getInitials(ride.rider)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="text-lg font-semibold line-clamp-1">
                      {ride.rider}
                    </h2>

                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <Clock3 className="h-4 w-4" />
                      <span>New Ride Request</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center text-primary font-bold text-2xl">
                    <IndianRupee className="h-5 w-5" />
                    {ride.fare}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Estimated Fare
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border bg-muted/30 p-4 space-y-5">
                <div className="flex items-start gap-4">
                  {/* ICON + LINE */}
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>

                    {/* CONNECTING LINE */}
                    <div className="w-0.5 h-10 bg-border mt-1" />
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Pickup
                    </p>

                    <h3 className="font-semibold text-sm leading-5 break-words mt-1">
                      {ride.pickupLocation.address}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Navigation className="h-5 w-5 text-red-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                      Drop
                    </p>

                    <h3 className="font-semibold text-sm leading-5 wrap-break mt-1">
                      {ride.dropLocation.address}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>

                  <h3 className="font-semibold">{ride.distance} KM</h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">OTP</p>

                  <h3 className="font-bold tracking-widest text-primary">
                    {ride.otp}
                  </h3>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => handleRideAccept(ride.rideId)}
                  className="flex-1 h-11 rounded-xl text-base font-semibold"
                >
                  Accept
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl text-base font-semibold"
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RideCard;
