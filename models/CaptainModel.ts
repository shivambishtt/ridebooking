import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { VehicleType } from "@/lib/types";

export interface ICaptain extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  vehicle: Schema.Types.ObjectId;
  vehicleType: VehicleType;
  walletBalance: number;
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

    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
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

    walletBalance: {
      type: Number,
      default: 0,
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
