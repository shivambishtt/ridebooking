import { VehicleType } from "@/models/VehicleModel";
import validNumberPlate from "@/lib/validNumberPlate";
import z from "zod";

export const vehicleFormSchema = z.object({
  vehicleType: z.enum(VehicleType),
  vehicleNumber: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => validNumberPlate(value), {
      message: "Invalid vehicle number plate",
    }),
  vehicleBrand: z.string().min(2, "Invalid vehicle brand name"),
  vehicleModel: z.string(),
});
