import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface ICaptain extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  provider: "credentials" | "google" | "github";
  rating: number;
  isAvailable: boolean;
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

    phoneNumber: {
      type: String,
      reqiured: [true, "Phone number is required"],
      unique: true,
    },
    rating: {
      type: Number,
      default: 5,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);

export const Captain =
  mongoose.models?.Captain ??
  mongoose.model<ICaptain>("Captain", captainSchema);

captainSchema.pre("save", async function () {
  if (!this.isModified("password"))
    try {
      this.password = await bcrypt.hash("password", 10);
    } catch (error: any) {
      throw new Error(error.message);
    }
});
