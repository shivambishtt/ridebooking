import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

enum Role {
  captain = "captain",
  user = "user",
}
interface User extends Document {
  name: string;
  email: string;
  password?: string;
  provider: "credentials" | "google" | "github";
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
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
    role: {
      type: String,
      default: Role.captain,
    },
  },
  {
    timestamps: true,
  },
);

export const User =
  mongoose?.models?.User<User> ?? mongoose.model<User>("User", userSchema);

userSchema.pre("save", async function () {
  if (!this.isModified("password"))
    try {
      this.password = await bcrypt.hash("password", 10);
    } catch (error: any) {
      throw new Error(error.message);
    }
});
