import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

enum PaymentMode {
  UPI = "UPI",
  CASH = "Cash",
}

interface IPayment extends Document {
  ride: Schema.Types.ObjectId;
  amount: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  transactionId: string;
}

const paymentSchema = new Schema<IPayment>({
  ride: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: Object.values(PaymentMode),
    default: PaymentMode.UPI,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Payment =
  mongoose.models.Payment<IPayment> ??
  mongoose.model<IPayment>("Payment", paymentSchema);

// hook generating transaction ID if not changed
paymentSchema.pre("validate", async function () {
  if (!this.isModified("transactionId")) return;
  this.transactionId = `t_ID-${randomUUID()}`;
});

// ensures if status is success that means ride has been completed
paymentSchema.post("save", async function (doc) {
  if (doc.paymentStatus === "success") {
    await mongoose.model("Ride").findByIdAndUpdate(doc.ride, {
      status: "completed",
    });
  }
});
