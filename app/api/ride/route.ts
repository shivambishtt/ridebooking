import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/UserModel";
import { Captain } from "@/models/CaptainModel";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "user") {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        { status: 400 },
      );
    }

    const { pickupLocation, dropLocation, userId, distance } = await req.json();

    if (!pickupLocation || !dropLocation || !userId || !distance) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 409 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const captains = await Captain.find({ isAvailable: true }).limit(5);
    if (captains.length === 0) {
      return NextResponse.json(
        { error: "No captains available right now" },
        { status: 400 },
      );
    }
    const ride = await Ride.create({
      rider: userId,
      pickupLocation,
      dropLocation,
      distance,
    });
    return NextResponse.json(
      {
        message: "Ride created successfully",
        ride,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unknown error occured" },
      { status: 500 },
    );
  }
}
