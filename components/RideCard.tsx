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

function RideCard({ rides }: { rides: Ride[] }) {
  const handleRideAccept = async () => {};

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
                <span className="font-semibold text-primary">₹250</span>
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
                  onClick={handleRideAccept}
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
