import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { User } from "@/models/UserModel";
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

    const rides = await Ride.find({
      captain: captainId,
    });

    if (!rides || rides.length === 0) {
      return NextResponse.json({
        message: "No rides found for the captain",
      });
    }

    const walletBalance = await Payment.aggregate([
      {
        $match: { captain: new mongoose.Types.ObjectId(captainId) },
      },
      { $group: { _id: null, totalEarnings: { $sum: "$amount" } } },
    ]);
  } catch (error) {
    console.log("Ride details API error", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
