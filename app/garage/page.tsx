"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { VehicleType } from "@/lib/types";

interface Vehicle {
  vehicle: {
    vehicleType: VehicleType;
    vehicleModel: string;
    vehicleColor: string;
    vehicleNumber: string;
    vehicleBrand: string;
    isVerified: boolean;
    status: "active" | "inactive";
  };
}

function Garage() {
  const session = useSession();
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const response = await fetch("/api/captain/garage/vehicle");
      const data = await response.json();
      console.log("Vehicle data", data);
      setVehicleData(data);
    };
    if (session?.data?.user.role === "captain") {
      fetchVehicleDetails();
    }
  }, [session]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
        Vehicle Details
      </h1>
      {vehicleData && (
        <div className="mx-auto mt-8 max-w-4xl">
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

              <span
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  vehicleData.vehicle.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {vehicleData.vehicle.status}
              </span>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle Type
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {vehicleData.vehicle.vehicleType}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Registration Number
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
                  {vehicleData.vehicle.vehicleNumber}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Brand
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {vehicleData.vehicle.vehicleBrand}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Model
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {vehicleData.vehicle.vehicleModel}
                </h3>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle Color
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border border-gray-300 bg-gray-300"></div>

                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicleData.vehicle.vehicleColor}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verification
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    vehicleData.vehicle.isVerified
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {vehicleData.vehicle.isVerified
                    ? "✓ Verified"
                    : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Garage;
