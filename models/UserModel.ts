import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  location?: {
    type: "Point";
    coorindates: number[];
  };
  provider: "credentials" | "google" | "github";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
      required: [true, "Phone number is required"],
      unique: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
  },
  {
    timestamps: true,
  },
);

export const User =
  mongoose?.models?.User<IUser> ?? mongoose.model<IUser>("User", userSchema);

userSchema.pre("save", async function () {
  if (this.isModified("password")) return;
  try {
     this.password = await bcrypt.hash(this.password as string, 10);
  } catch (error: any) {
    throw new Error(error.message);
  }
});
