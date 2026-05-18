import { NextResponse, NextRequest } from "next/server";
import { Captain } from "@/models/CaptainModel";
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

    const existingCaptain = await Captain.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingCaptain) {
      return NextResponse.json(
        { message: "Account already exists with this email or phone number" },
        { status: 409 },
      );
    }
    const walletBalance = 0;

    const user = await Captain.create({
      name,
      email,
      password,
      phoneNumber,
      walletBalance,
    });

    return NextResponse.json(
      {
        message: "Captain created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Signup API error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
