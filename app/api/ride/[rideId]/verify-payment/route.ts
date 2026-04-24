import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import crypto from "crypto";
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

    const { razorpay_order_id, razorpay_signature, razorpay_payment_id } =
      await req.json();

    if (!razorpay_order_id || !razorpay_signature || !razorpay_payment_id) {
      return NextResponse.json(
        {
          message: "Missing razorpay config",
        },
        { status: 400 },
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_SECRET_KEY as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 },
      );
    }

    const payment = await Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
      },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "success",
        },
      },
      { new: true },
    );

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Payment successful", payment },
      { status: 200 },
    );
  } catch (error) {
    console.log("Verify Payment API error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
