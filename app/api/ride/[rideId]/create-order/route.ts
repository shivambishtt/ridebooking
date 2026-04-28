import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
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
      amount: order.amount,
      orderId: order.id,
      paymentStatus: "pending",
      paymentMode: "UPI",
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
