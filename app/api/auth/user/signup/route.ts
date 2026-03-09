import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/models/UserModel";
import connectDB from "@/lib/connectDB";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phoneNumber } = await req.json();

    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Account already exists with this email or phone number" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "An unknown error occured", error: error.message },
      { status: 500 },
    );
  }
}
