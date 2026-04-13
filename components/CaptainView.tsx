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

function CaptainView() {
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
              <h1 className="text-md font-semibold">
                Going to pickup • 300m away
              </h1>
            </span>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-nowrap">
                <CardTitle className="text-xl">Aman Sharma</CardTitle>
                <CardTitle className="text-md">⭐4.2</CardTitle>
              </div>

              <Avatar>
                <AvatarFallback className="bg-blue-500 text-white">
                  {getInitials("Aman Sharma")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center justify-center">
              <CardTitle className="text-md">📞 Number</CardTitle>
            </div>

            <CardDescription className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-semibold text-md">
                    Pickup: Dwarka Mor
                  </CardTitle>
                  <CardTitle className="font-semibold text-md">
                    Distance: 300m
                  </CardTitle>
                </div>
                <div>
                  <CardTitle>ETA: 2 min</CardTitle>
                </div>
              </div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-between">
            <Button className=" hover:cursor-pointer w-full bg-primary text-black">
              Arrived
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CaptainView;
