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

function RiderView() {
  return (
    <div className="p-10 min-h-screen ">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-primary">Captain</span> Details
        </h1>
      </div>
      <div>
        <Card className="relative mx-auto w-full max-w-sm pt-0">
          <div className="absolute inset-0  z-30 aspect-video bg-black/35" />
          <Image
            width={20}
            height={30}
            src=""
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
          <CardHeader>
            <span className="flex items-center justify-center">
              <h1 className="text-md font-semibold">
                Captain is on the way 300m
              </h1>
            </span>
            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-nowrap">
                <CardTitle className="text-xl">Shivam Bisht</CardTitle>
                <CardTitle className="text-md">⭐4.5</CardTitle>
              </div>

              <span>
                <Avatar>
                  <AvatarFallback className="bg-red-500 text-white">
                    {getInitials("Shivam Bisht")}
                  </AvatarFallback>
                </Avatar>
              </span>
            </div>

            <div className="flex items-center justify-center">
              <CardTitle className="text-md">📞 Phone number</CardTitle>
            </div>

            <CardDescription className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-semibold text-md">
                    DL 9SCU 4091
                  </CardTitle>
                  <CardTitle className="font-semibold text-md">
                    Bajaj Pulsar N160
                  </CardTitle>
                </div>
                <div>
                  <CardTitle>Capacity:2</CardTitle>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RiderView;
