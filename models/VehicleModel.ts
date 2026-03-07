import mongoose, { Schema, Document } from "mongoose";

export enum VehicleType {
  FOUR_WHEELER = "fourWheeler",
  TRI_WHEELER = "triWheeler",
  TWO_WHEELER = "twoWheeler",
}

interface IVehicle extends Document {
  captain: Schema.Types.ObjectId;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleColor: string;
  vehicleModel: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    captain: {
      type: Schema.Types.ObjectId,
      ref: "Captain",
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      default: VehicleType.FOUR_WHEELER,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleColor: {
      type: String,
    },
    vehicleModel: {
      type: String,
      required: true,
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
