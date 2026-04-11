"use client";
import { useState } from "react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { rideFormSchema } from "@/validations/rideValidation";
import { zodResolver } from "@hookform/resolvers/zod";

function RiderRides() {
  const form = useForm<z.infer<typeof rideFormSchema>>({
    resolver: zodResolver(rideFormSchema),
    defaultValues: {
      from: "",
      to: "",
      vehicleType: "",
    },
  });
  const session = useSession();
  const [fromAuto, setFromAuto] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [toAuto, setToAuto] = useState<google.maps.places.Autocomplete | null>(
    null,
  );
  const [vehicle, setVehicle] = useState("two_wheeler");
  const [loading, setLoading] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (values) => {
    setLoading(true);
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
    }
    setLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="p-10 min-h-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold ">
          Book a <span className="text-primary">Ride</span>
        </h1>
        <div className="w-full">
          <div className="location-coordinates py-6">
            <Autocomplete
              onLoad={(auto) => setFromAuto(auto)}
              onPlaceChanged={() => {
                if (!toAuto) return;
                const place = toAuto.getPlace();
                if (place?.formatted_address) {
                  setValue("to", place.formatted_address);
                }
              }}
            >
              <InputGroup className="h-8">
                <InputGroupInput
                  {...form.register("from")}
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
                <InputGroupInput {...form.register("to")} placeholder="To" />
                <InputGroupAddon>
                  <MapPinCheck />
                </InputGroupAddon>
              </InputGroup>
            </Autocomplete>
          </div>

          <VehicleCard
            selected={vehicle}
            onSelect={(type) => setVehicle(type)}
          />
          <div
            className="flex items-center
         justify-center"
          >
            {loading ? (
              <Button disabled type="submit">
                Request Ride
              </Button>
            ) : (
              <Button type="submit">Request Ride</Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default RiderRides;
