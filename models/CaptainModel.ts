import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { VehicleType } from "./VehicleModel";

export interface ICaptain extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  vehicleType: VehicleType;
  provider: "credentials" | "google" | "github";
  rating: number;
  isAvailable: boolean;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  socketId?: string;
}

const captainSchema = new Schema<ICaptain>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    rating: {
      type: Number,
      default: 5,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },

      coordinates: {
        type: [Number],
      },
    },
    socketId: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);

captainSchema.index({ location: "2dsphere" });

captainSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    this.password = await bcrypt.hash(this.password as string, 10);
  } catch (error: any) {
    throw new Error(error.message);
  }
});
export const Captain =
  mongoose.models?.Captain ??
  mongoose.model<ICaptain>("Captain", captainSchema);
