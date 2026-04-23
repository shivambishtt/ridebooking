import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ rideId: string }> },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session?.user.role !== "captain") {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        { status: 401 },
      );
    }

    const { rideId } = await params;
    if (!rideId) {
      return NextResponse.json(
        { message: "Ride ID is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return NextResponse.json({ message: "Invalid Ride ID" }, { status: 400 });
    }

    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json(
        { message: "OTP not provided" },
        { status: 409 },
      );
    }

    const ride = await Ride.findOne({
      _id: rideId,
      captain: session.user.id,
      status: "arrived",
    });

    if (!ride) {
      return NextResponse.json(
        { message: "Ride not found or not accepted by the captain" },
        { status: 404 },
      );
    }

    if (ride.otp !== otp) {
      return NextResponse.json(
        { message: "Incorrect OTP. Please enter again" },
        { status: 404 },
      );
    }

    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId, captain: session.user.id, status: "arrived" },
      {
        $set: {
          status: "ongoing",
          otp: null,
        },
      },
      { new: true },
    );

    return NextResponse.json(
      {
        message: "Ride started by the captain",
        ride: {
          _id: updatedRide._id,
          status: updatedRide.status,
          pickupLocation: updatedRide.pickupLocation,
          dropLocation: updatedRide.dropLocation,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ride Start API error", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
