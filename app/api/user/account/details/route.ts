import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { User } from "@/models/UserModel";
import { Payment } from "@/models/PaymentModel";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
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

    const userId = session.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "Rider not found" }, { status: 404 });
    }

    const ride = await Ride.findOne({
      rider: userId,
      status: "completed",
    });

    const totalRides = await Ride.countDocuments({
      rider: userId,
    });

    const moneySpent = await Payment.aggregate([
      {
        $match: {
          rider: new mongoose.Types.ObjectId(userId),
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          moneySpent: { $sum: "$amount" },
        },
      },
    ]);

    const totalSpent = moneySpent.length > 0 ? moneySpent[0].moneySpent : 0;

    const recentRides = await Ride.find({
      rider: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json(
      {
        success: true,
        rider: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
        },
        stats: {
          ride,
          totalRides,
          recentRides,
          totalSpent,
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
