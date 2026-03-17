"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { vehicleFormSchema } from "@/validations/vehicleValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleType } from "@/models/VehicleModel";

type VehicleForm = {
  vehicleType: string;
  model: string;
  numberPlate: string;
  color: string;
  capacity: number;
};

export default function AddVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof vehicleFormSchema>
  >({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleType: VehicleType.TWO_WHEELER,
      vehicleNumber: "",
      vehicleBrand: "",
      vehicleModel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    try {
      setLoading(true);

      const res = await fetch("/api/captain/vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        return;
      }

      reset();

      // ✅ redirect to dashboard after success
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Add Your Vehicle 🚗</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Vehicle Type (Car/Bike)"
            {...register("vehicleType", { required: true })}
          />

          <Input
            placeholder="Model (e.g. Swift, Activa)"
            {...register("model", { required: true })}
          />

          <Input
            placeholder="Number Plate"
            {...register("numberPlate", { required: true })}
          />

          <Input
            placeholder="Color"
            {...register("color", { required: true })}
          />

          <Input
            type="number"
            placeholder="Capacity (e.g. 4)"
            {...register("capacity", { required: true })}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        </form>
      </div>
    </div>
  );
}
