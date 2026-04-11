import { z } from "zod";
import { VehicleType } from "@/lib/types";

export const rideFormSchema = z.object({
  from: z.string().min(3, "Pickup location is required"),
  to: z.string().min(3, "Drop location is required"),
  vehicleType: z.enum(Object.values(VehicleType) as [string, ...string[]]),
});
