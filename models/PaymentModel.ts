import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  TIMEOUT = "timeout",
}
enum PaymentMode {
  UPI = "UPI",
  CARD = "CARD",
  NETBANKING = "NETBANKING",
  CASH = "CASH",
}

interface IPayment extends Document {
  ride: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  transactionId: string;
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PaymentMode),
      default: PaymentMode.UPI,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    orderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Payment =
  mongoose.models.Payment<IPayment> ??
  mongoose.model<IPayment>("Payment", paymentSchema);

paymentSchema.pre("validate", function () {
  if (!this.transactionId) {
    this.transactionId = `t_ID-${randomUUID()}`;
  }
});

paymentSchema.post("save", async function (doc) {
  if (doc.paymentStatus === "success") {
    await mongoose.model("Ride").findByIdAndUpdate(doc.ride, {
      status: "completed",
    });
  }
});
