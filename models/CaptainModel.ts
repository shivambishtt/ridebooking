import mongoose, { Schema, Document } from "mongoose";

export interface ICaptain extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  provider: "credentials" | "google" | "github";
  rating: number;
  isAvailable: boolean;
}

const captainSchema = new Schema<ICaptain>(
  {
    name: {
      type: String,
      required: true,
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

    phoneNumber: {
      type: String,
      phoneNumber: {
        type: String,
        reqiured: [true, "Phone number is required"],
      },
    },
    rating: {
      type: Number,
      default: 5,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Captain =
  mongoose.models?.Captain ??
  mongoose.model<ICaptain>("Captain", captainSchema);
