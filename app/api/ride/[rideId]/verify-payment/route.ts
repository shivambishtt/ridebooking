import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";
import { Payment } from "@/models/PaymentModel";

export async function POST(
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
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return NextResponse.json(
        {
          message: "Ride with this ride ID not found",
        },
        { status: 404 },
      );
    }
  } catch (error) {
    console.log("Verify Payment API error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
