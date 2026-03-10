import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Captain } from "@/models/CaptainModel";

export async function POST(req: NextRequest) {
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

    const { rideId } = await req.json();
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

    // race condition
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, status: "searching" },
      { $set: { status: "accepted", captain: captain._id } },
      { new: true },
    );
    if (!ride) {
      return NextResponse.json(
        {
          message: "Ride already taken or not found.",
        },
        { status: 409 },
      );
    }

    await Captain.findByIdAndUpdate(captain._id, { isAvailable: false });

    return NextResponse.json({
      message: "Ride accepted",
      ride,
    });
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
