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
  availableCaptains: Schema.Types.ObjectId[] | null;
  pickupLocation: {
    address: string;
    coordinates: number[];
  };
  dropLocation: {
    address: string;
    coordinates: number[];
  };
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
    availableCaptains: [
      {
        type: Schema.Types.ObjectId,
        ref: "Captain",
        default: null,
      },
    ],
    pickupLocation: {
      address: String,
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropLocation: {
      address: String,
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    distance: {
      type: Number,
      required: true,
      min: 0.5,
    },
    fare: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.SEARCHING,
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
  const BASE_FARE = 40;
  const FARE_PER_KM = 12;

  this.fare = BASE_FARE + this.distance * FARE_PER_KM;
});

export const Ride =
  mongoose?.models?.Ride<IRide> ?? mongoose.model<IRide>("Ride", rideSchema);
