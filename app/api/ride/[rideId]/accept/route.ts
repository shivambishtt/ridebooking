import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Captain } from "@/models/CaptainModel";

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
        {
          message: "Ride ID is required",
        },
        { status: 400 },
      );
    }
    const captain = await Captain.findOne({ _id: session.user.id });

    if (!captain || !captain.isAvailable) {
      return NextResponse.json(
        { message: "No captains right now. Sorry for the inconvenience" },
        { status: 400 },
      );
    }

    const activeRide = await Ride.findOne({
      captain: captain._id,
      status: { $in: ["accepted", "ongoing"] },
    });
    if (activeRide) {
      return NextResponse.json(
        { message: "You already have an active ride" },
        { status: 409 },
      );
    }

    const ride = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        status: "searching",
        availableCaptains: { $in: [captain._id] },
      },
      { $set: { status: "accepted", captain: captain._id } },
      { new: true },
    ).populate("rider", "name phoneNumber");

    if (!ride) {
      return NextResponse.json(
        {
          message: "Ride already taken or not found.",
        },
        { status: 409 },
      );
    }

    await Captain.findByIdAndUpdate(captain._id, {
      $set: {
        isAvailable: false,
      },
    });

    return NextResponse.json(
      {
        message: "Ride accepted",
        ride: {
          _id: ride._id,
          status: ride.status,
          pickupLocation: ride.pickupLocation,
          dropLocation: ride.dropLocation,
          distance: ride.distance,
          fare: ride.fare,
          createdAt: ride.createdAt,
        },
        rider: {
          name: ride.rider.name,
          phone: ride.rider.phoneNumber,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in ride accept:", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
