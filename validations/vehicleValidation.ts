import validNumberPlate from "@/lib/validNumberPlate";
import z from "zod";

export const vehicleFormSchema = z.object({
  vehicleType: z.string(),
  vehicleNumber: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => validNumberPlate(value), {
      message: "Invalid vehicle number plate",
    }),
  vehicleBrand: z.string().min(2, "Invalid vehicle brand name"),
  vehicleColor: z.string().min(3, "Invalid color"),
  vehicleModel: z.string(),
});
