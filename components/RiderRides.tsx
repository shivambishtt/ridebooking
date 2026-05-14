"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MapPin, MapPinCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import VehicleCard from "./VehicleCard";
import { useRouter } from "next/navigation";
import { VehicleType } from "@/lib/types";
import socket from "@/lib/socket";

const RideMap = dynamic(() => import("@/components/RideMap"), {
  ssr: false,
});

function RiderRides() {
  const session = useSession();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);

  const [fromCoordinates, setFromCoordinates] = useState<
    [number, number] | null
  >(null);

  const [toCoordinates, setToCoordinates] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    const userId = session?.data?.user.id;
    if (!userId) return;

    socket.emit("join", { userId });
    socket.on("ride-accepted", ({ rideId }) => {
      router.push(`/ride/${rideId}`);
    });

    return () => {
      socket.off("ride-accepted");
    };
  }, [router, session?.data?.user.id]);

  const searchLocation = async (query: string, type: "from" | "to") => {
    if (query.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`,
      );

      const data = await response.json();

      if (type === "from") {
        setFromSuggestions(data);
      } else {
        setToSuggestions(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRide = async () => {
    if (!fromCoordinates || !toCoordinates) {
      toast.error("Select pickup and drop locations from suggestions.", {
        position: "top-center",
        style: {
          background: "#D50419",
        },
      });

      return;
    }

    const response = await fetch("/api/ride/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupLocation: {
          address: from,
          coordinates: fromCoordinates,
        },
        dropLocation: {
          address: to,
          coordinates: toCoordinates,
        },
        rider: session?.data?.user.id,
        distance: 5,
        vehicleType: vehicle,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(data.message, {
        position: "top-center",

        style: {
          background: "#418B24",
        },
      });
    } else {
      toast.error(data.message, {
        position: "top-center",

        style: {
          background: "#D50419",
        },
      });
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
        Book a <span className="text-primary">Ride</span>
      </h1>

      <div className="w-full">
        <div className="location-coordinates py-6">
          <div className="relative">
            <InputGroup className="h-8">
              <InputGroupInput
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);

                  searchLocation(e.target.value, "from");
                }}
                placeholder="From"
              />

              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
            </InputGroup>

            {fromSuggestions.length > 0 && (
              <div className="absolute z-50 bg-white text-black w-full border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {fromSuggestions.map((item) => (
                  <div
                    key={item.place_id}
                    className="p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setFrom(item.display_name);

                      setFromCoordinates([
                        parseFloat(item.lon),
                        parseFloat(item.lat),
                      ]);

                      setFromSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-4">
            <InputGroup className="h-8">
              <InputGroupInput
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);

                  searchLocation(e.target.value, "to");
                }}
                placeholder="To"
              />

              <InputGroupAddon>
                <MapPinCheck />
              </InputGroupAddon>
            </InputGroup>

            {toSuggestions.length > 0 && (
              <div className="absolute z-50 bg-white text-black w-full border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {toSuggestions.map((item) => (
                  <div
                    key={item.place_id}
                    className="p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setTo(item.display_name);

                      setToCoordinates([
                        parseFloat(item.lon),
                        parseFloat(item.lat),
                      ]);

                      setToSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <VehicleCard selected={vehicle} onSelect={(type) => setVehicle(type)} />

        {fromCoordinates && (
          <div className="mt-6 rounded-3xl overflow-hidden border border-border">
            <Suspense
              fallback={
                <div className="h-96 w-full bg-gray-200 animate-pulse rounded-3xl flex items-center justify-center">
                  Loading map...
                </div>
              }
            >
              <RideMap
                pickupPosition={[fromCoordinates[1], fromCoordinates[0]]}
                dropPosition={
                  toCoordinates
                    ? [toCoordinates[1], toCoordinates[0]]
                    : undefined
                }
              />
            </Suspense>
          </div>
        )}

        <div className="flex items-center justify-center mt-5">
          <Button onClick={handleCreateRide}>Request Ride</Button>
        </div>
      </div>
    </div>
  );
}

export default RiderRides;
