import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import "@/models/VehicleModel";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rideId: string }> },
) {
  try {
    await connectDB();
    const { rideId } = await params;
    if (!rideId) {
      return NextResponse.json(
        {
          message: "Error in getting rideId from params",
        },
        { status: 402 },
      );
    }
    const ride = await Ride.findById(rideId)
      .populate({
        path: "captain",
        populate: {
          path: "vehicle",
        },
      })
      .populate("rider");
    if (!ride) {
      return NextResponse.json(
        {
          message: "Ride with this ID not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Ride ID fetched successfully", ride },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Ride fetch API Error", error },
      { status: 500 },
    );
  }
}
