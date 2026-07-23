"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { VehicleType } from "@/lib/types";
import { VehicleTypeLabel } from "@/lib/types";
import { Switch } from "@/components/ui/switch";

interface Vehicle {
  _id: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleColor: string;
  vehicleNumber: string;
  vehicleBrand: string;
  isVerified: boolean;
  status: "active" | "inactive";
}

function Garage() {
  const session = useSession();
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const response = await fetch("/api/captain/garage/vehicle");
      const data = await response.json();
      setVehicleData(data.vehicles || []);
    };
    if (session?.data?.user.role === "captain") {
      fetchVehicleDetails();
    }
  }, [session]);

  const handleStatusToggle = async (vehicleId: string, checked: boolean) => {
    const nextStatus = checked ? "active" : "inactive";
    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const response = await fetch("/api/captain/garage/vehicle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId, status: nextStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update vehicle status");
      }

      setVehicleData((prev) =>
        prev.map((vehicle) =>
          vehicle._id === vehicleId
            ? { ...vehicle, status: nextStatus }
            : vehicle,
        ),
      );
    } catch (error) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to update vehicle status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
        Vehicle Details
      </h1>
      {vehicleData.map((vehicle) => {
        return (
          <div key={vehicle._id} className="mx-auto mt-8 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Vehicle
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your registered vehicle details.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Inactive
                  </span>

                  <Switch
                    checked={vehicle.status === "active"}
                    onCheckedChange={(checked) =>
                      handleStatusToggle(vehicle._id, checked)
                    }
                    disabled={isUpdatingStatus}
                  />

                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active
                  </span>
                </div>
              </div>

              {statusError && (
                <div className="border-t border-gray-200 px-6 py-3 text-sm text-red-600 dark:border-neutral-800 dark:text-red-400">
                  {statusError}
                </div>
              )}

              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vehicle Type
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {VehicleTypeLabel[vehicle.vehicleType]}
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Registration Number
                  </p>

                  <h3 className="mt-1 text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
                    {vehicle.vehicleNumber}
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Brand
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicle.vehicleBrand}
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Model
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicle.vehicleModel}
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vehicle Color
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border border-gray-300 bg-gray-300"></div>

                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vehicle.vehicleColor}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Verification
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      vehicle.isVerified
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {vehicle.isVerified ? "✓ Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Garage;
