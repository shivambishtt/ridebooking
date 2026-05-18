import mongoose, { Schema } from "mongoose";

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
  rider?: Schema.Types.ObjectId;
  captain?: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
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
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: "Captain",
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
      default: null,
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

paymentSchema.post("save", async function (doc) {
  if (doc.paymentStatus === "success") {
    await mongoose.model("Ride").findByIdAndUpdate(doc.ride, {
      status: "completed",
    });
  }
});

export const Payment =
  mongoose.models.Payment<IPayment> ??
  mongoose.model<IPayment>("Payment", paymentSchema);
