import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Captain } from "@/models/CaptainModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Ride } from "@/models/RideModel";
import mongoose from "mongoose";
import { calculateFare } from "@/lib/calculateFare";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ rideId: string }> },
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "captain") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        captain: session.user.id,
        status: "ongoing",
      },
      { $set: { status: "completed" } },
      { new: true },
    );

    const fare = calculateFare(ride.distance);

    if (!ride) {
      return NextResponse.json(
        { message: "Ride not found or not ongoing" },
        { status: 404 },
      );
    }

    await Captain.findByIdAndUpdate(session.user.id, {
      isAvailable: true,
    });

    return NextResponse.json(
      {
        message: "Ride completed successfully. Collect fare",
        ride: {
          fare,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("End ride API error", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
