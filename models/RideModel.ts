import mongoose, { Schema } from "mongoose";

enum RideStatus {
  SEARCHING = "searching",
  BOOKED = "booked",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  TIMEOUT = "timeout",
}
enum PaymentStatus {
  PENDING = "pending",
  FAILED = "failed",
  COMPLETED = "completed",
}

enum PaymentMode {
  UPI = "UPI",
  CASH = "Cash",
}

interface IRide {
  rider: Schema.Types.ObjectId;
  captain?: Schema.Types.ObjectId | null;
  pickupLocation: string;
  dropLocation: string;
  status: RideStatus;
  fare: number;
  distance: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.SEARCHING,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
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
  },
  { timestamps: true },
);

export const Ride =
  mongoose?.models?.Ride<IRide> ?? mongoose.model<IRide>("Ride", rideSchema);
