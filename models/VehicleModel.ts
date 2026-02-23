import mongoose, { Schema } from "mongoose";

enum VehicleCategory {
  FOUR_WHEELER = "fourWheeler",
  TRI_WHEELER = "triWheeler",
  TWO_WHEELER = "twoWheeler",
}

interface IVehicle extends Document {
  captain: Schema.Types.ObjectId;
  vehicleType: VehicleCategory;
  vehicleNumberPlate: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    captain: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleCategory),
      default: VehicleCategory.FOUR_WHEELER,
      required: true,
    },
    vehicleNumberPlate: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Vehicle =
  mongoose?.models?.Vehicle<IVehicle> ??
  mongoose.model<IVehicle>("Vehicle", vehicleSchema);
