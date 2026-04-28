"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
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

function RiderRides() {
  const session = useSession();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAuto, setFromAuto] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [toAuto, setToAuto] = useState<google.maps.places.Autocomplete | null>(
    null,
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries: ["places"],
  });

  useEffect(() => {
    if (session?.data?.user?.id) {
      socket.emit("join", { userId: session.data.user.id });
    }
    return () => {
      socket.off("join");
    };
  }, [session]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  const handleCreateRide = async () => {
    const response = await fetch("/api/ride/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupLocation: {
          address: "Dwarka Mor",
          coordinates: [77.1025, 28.7041],
        },
        dropLocation: {
          address: "Karol Bagh",
          coordinates: [77.2167, 28.6448],
        },
        rider: session?.data?.user.id,
        distance: 5,
        vehicleType: vehicle,
      }),
    });
    const data = await response.json();
    const rideId = data?.ride?._id;
    if (response.ok) {
      toast.success(data.message, {
        position: "top-center",
        style: {
          background: "#418B24",
        },
      });
      router.push(`/ride/${rideId}`);
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold ">
        Book a <span className="text-primary">Ride</span>
      </h1>
      <div className="w-full">
        <div className="location-coordinates py-6">
          <Autocomplete
            onLoad={(auto) => setFromAuto(auto)}
            onPlaceChanged={() => {
              if (!fromAuto) return;
              const place = fromAuto.getPlace();
              if (place?.formatted_address) {
                setFrom(place.formatted_address);
              }
            }}
          >
            <InputGroup className="h-8">
              <InputGroupInput
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From"
              />
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
            </InputGroup>
          </Autocomplete>
          <br />

          <Autocomplete
            onLoad={(auto) => setToAuto(auto)}
            onPlaceChanged={() => {
              if (!toAuto) return;
              const place = toAuto.getPlace();
              if (place.formatted_address) {
                setTo(place.formatted_address);
              }
            }}
          >
            <InputGroup className="h-8">
              <InputGroupInput
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
              />
              <InputGroupAddon>
                <MapPinCheck />
              </InputGroupAddon>
            </InputGroup>
          </Autocomplete>
        </div>

        <VehicleCard selected={vehicle} onSelect={(type) => setVehicle(type)} />
        <div className="flex items-center justify-center mt-5">
          <Button className="" onClick={handleCreateRide}>
            Request Ride
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RiderRides;
