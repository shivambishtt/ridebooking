import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/UserModel";
import { Captain } from "@/models/CaptainModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "user") {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        { status: 401 },
      );
    }

    const { pickupLocation, dropLocation, rider, distance } = await req.json();

    if (!pickupLocation || !dropLocation || !rider || !distance) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 409 },
      );
    }

    const user = await User.findById(rider);
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
      rider,
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
    console.error("Error in creating ride",error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
