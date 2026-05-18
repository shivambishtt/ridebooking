import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import Razorpay from "razorpay";
import { Payment } from "@/models/PaymentModel";

if (
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_SECRET_KEY
) {
  console.log("Environment variables missing");
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_KEY as string,
});

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

    const existingPayment = await Payment.findOne({
      ride: ride._id,
      paymentStatus: { $in: ["pending", "success"] },
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already initiated for this ride" },
        { status: 409 },
      );
    }

    const order = await razorpay.orders.create({
      amount: ride.fare * 100,
      currency: "INR",
      receipt: ride._id.toString(),
      notes: {
        rideId: ride._id.toString(),
      },
    });

    const payment = await Payment.create({
      ride: ride._id,
      rider: ride.rider,
      captain: ride.captain,
      amount: order.amount,
      orderId: order.id,
      paymentStatus: "pending",
      paymentMode: null,
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
        paymentId: payment._id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Create Order API error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
