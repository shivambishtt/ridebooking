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

function RideCard() {
  const handleRideAccept = async () => {};

  return (
    <div className="max-w-sm w-full relative">
      <Card className="w-full rounded-2xl shadow-lg border border-gray-100">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="TS"
              className="grayscale"
            />
            <AvatarFallback>{getInitials("TS")}</AvatarFallback>
          </Avatar>

          <div className="flex items-center justify-between flex-1">
            <CardTitle className="text-lg font-semibold">Tanvi Saini</CardTitle>
            <span className="font-semibold text-primary">₹250</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center text-center gap-2">
            <span className="font-semibold text-xl">From</span>
            <span className="text-nowrap">
              H.No. 175-176 Dwarka Mor, New Delhi
            </span>
          </div>
          <div className="flex items-center text-center gap-2">
            <span className="font-semibold text-xl ">To</span>
            <span>Plot No. 51, Karol Bagh</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button onClick={handleRideAccept} className="w-full bg-primary">
              Accept
            </Button>
            <Button className="w-full">Reject</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RideCard;
