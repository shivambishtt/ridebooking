import mongoose, { Schema } from "mongoose";

enum RideStatus {
  SEARCHING = "searching",
  BOOKED = "booked",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  TIMEOUT = "timeout",
}

interface IRide extends Document {
  rider: Schema.Types.ObjectId;
  captain?: Schema.Types.ObjectId | null;
  pickupLocation: string;
  dropLocation: string;
  status: RideStatus;
  fare: number;
  distance: number;
  payment?: Schema.Types.ObjectId | null;
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
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  { timestamps: true },
);

export const Ride =
  mongoose?.models?.Ride<IRide> ?? mongoose.model<IRide>("Ride", rideSchema);

rideSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  const validTransitions: Record<string, string[]> = {
    searching: ["booked", "timeout", "cancelled"],
    booked: ["ongoing", "cancelled"],
    ongoing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
    timeout: [],
  };

  const previousStatus = this.$__.priorDoc?.status;

  if (
    previousStatus &&
    !validTransitions[previousStatus]?.includes(this.status)
  ) {
    throw new Error("Invalid ride status transition");
  }
});


rideSchema.pre("save", async function () {
  if (!this.isModified("distance")) return;
  const farePerKM: number = 12;
  this.fare = farePerKM * this.distance;
});
