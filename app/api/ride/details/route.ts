import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { Captain } from "@/models/CaptainModel";
import { Payment } from "@/models/PaymentModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const completedRides = await Ride.countDocuments({
      captain: captainId,
      status: "completed",
    });

    const cancelledRides = await Ride.countDocuments({
      captain: captainId,
      status: "cancelled",
    });

    const walletBalance = await Payment.aggregate([
      {
        $match: {
          captain: new mongoose.Types.ObjectId(captainId),
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" },
        },
      },
    ]);

    const totalEarnings =
      walletBalance.length > 0 ? walletBalance[0].totalEarnings : 0;

    const recentRides = await Ride.find({
      captain: captainId,
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
        },
        stats: {
          ride,
          totalRides,
          completedRides,
          cancelledRides,
          totalEarnings,
        },
        recentRides,
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
