"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useLoadScript } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  LocateIcon,
  MapPin,
  MapPinCheck,
  PinIcon,
  SearchIcon,
} from "lucide-react";

function Rides() {
  const session = useSession();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAuto, setFromAuto] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [toAuto, setToAuto] = useState<google.maps.places.Autocomplete | null>(
    null,
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY as string,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

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
      </div>
    </div>
  );
}

export default Rides;
