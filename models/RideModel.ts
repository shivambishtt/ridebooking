import mongoose, { Schema } from "mongoose";

enum RideStatus {
  SEARCHING = "searching",
  ACCEPTED = "accepted",
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
      ref: "Captain",
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
      // required: true,
    },
    fare: {
      type: Number,
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

rideSchema.pre("save", async function () {
  if (!this.isModified("status")) return;

  const validTransitions: Record<string, string[]> = {
    searching: ["accepted", "timeout", "cancelled"],
    accepted: ["ongoing", "cancelled"],
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
  this.fare = this.distance * farePerKM;
});

export const Ride =
  mongoose?.models?.Ride<IRide> ?? mongoose.model<IRide>("Ride", rideSchema);
