"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import RideCard from "./RideCard";

function CaptainRides() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch("/api/captain/location");
      const data = await response.json();
      if (response.ok) {
        setIsAvailable(data.isAvailable);
      }
    };
    fetchStatus();
  }, [isAvailable]);

  const handleChecked = async () => {
    const updatedStatus = !isAvailable;

    const response = await fetch("/api/captain/location", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longitude: 77.1025,
        latitude: 28.7041,
        isAvailable: updatedStatus,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message, {
        position: "top-center",
        style: { background: "#D50419" },
      });
    } else {
      setIsAvailable(data.captain.isAvailable);
      toast.success(data.message, {
        position: "top-center",
        style: {
          background: "#418B24",
        },
      });
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          Accept <span className="text-primary">Ride</span>
        </h1>
        <div className="flex gap-2">
          <Switch
            checked={isAvailable}
            onCheckedChange={handleChecked}
            id="online"
          />
          <Label htmlFor="online">{isAvailable ? "Online" : "Offline"}</Label>
        </div>
      </div>
      <div className="flex items-center justify-center flex-wrap h-[60vh]">
        {!isAvailable ? (
          <h1 className="text-2xl sm:text-3xl py-5 font-semibold">
            Welcome Captain. Go Online to get rides 🚀
          </h1>
        ) : (
          <h1 className="text-2xl sm:text-3xl py-5 font-semibold">
            Waiting for Rides ⏳
          </h1>
        )}
      <RideCard/>
      </div>
    </div>
  );
}

export default CaptainRides;
