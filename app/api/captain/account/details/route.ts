import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { Captain } from "@/models/CaptainModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 },
      );
    }

    const captainId = session.user.id;
    const captain = await Captain.findById(captainId).select("-password");

    if (!captain) {
      return NextResponse.json(
        { message: "Captain not found" },
        { status: 404 },
      );
    }

    const ride = await Ride.findOne({
      captain: captainId,
      status: "completed",
    });

    const totalRides = await Ride.countDocuments({
      captain: captainId,
    });

    const cancelledRides = await Ride.countDocuments({
      captain: captainId,
      status: "cancelled",
    });

    const wallet = await Captain.findById(captainId).select("walletBalance");

    const totalEarnings = wallet ? wallet.walletBalance : 0;

    const recentRides = await Ride.find({
      captain: captainId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const completedRides = await Ride.find({
      captain: captainId,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(
      {
        success: true,
        captain: {
          name: captain.name,
          email: captain.email,
          phoneNumber: captain.phoneNumber,
          createdAt: captain.createdAt,
          walletBalance: captain.walletBalance,
        },
        stats: {
          ride,
          totalRides,
          recentRides,
          completedRides,
          cancelledRides,
          totalEarnings,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Account details API error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
