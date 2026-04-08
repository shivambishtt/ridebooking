import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Ride } from "@/models/RideModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/UserModel";
import { Captain } from "@/models/CaptainModel";
import { validCoordinates } from "@/lib/validCoordinates";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "user") {
      return NextResponse.json(
        {
          message: "Unauthorized request",
        },
        { status: 401 },
      );
    }

    const { pickupLocation, dropLocation, rider, distance } = await req.json();

    if (!pickupLocation || !dropLocation || !rider || !distance) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 409 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(rider)) {
      return NextResponse.json({ message: "Invalid Ride ID" }, { status: 400 });
    }
    if (distance <= 0) {
      return NextResponse.json(
        { message: "Invalid distance" },
        { status: 400 },
      );
    }
    if (!validCoordinates(pickupLocation.coordinates)) {
      return NextResponse.json(
        { message: "Invalid pickup coordinates" },
        { status: 400 },
      );
    }

    if (!validCoordinates(dropLocation.coordinates)) {
      return NextResponse.json(
        { message: "Invalid drop coordinates" },
        { status: 400 },
      );
    }

    const [pickupLongitude, pickupLatitude] = pickupLocation.coordinates;

    const user = await User.findById(rider);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const activeRide = await Ride.findOne({
      rider,
      status: {
        $in: ["searching", "accepted", "ongoing"],
      },
    });

    if (activeRide) {
      return NextResponse.json(
        {
          message: "You already have an active ride",
        },
        { status: 409 },
      );
    }

    const captains = await Captain.find({
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickupLongitude, pickupLatitude],
          },
          $maxDistance: 5000,
        },
      },
    }).limit(5);

    if (captains.length === 0) {
      return NextResponse.json(
        { message: "No captains available right now" },
        { status: 400 },
      );
    }

    const availableCaptains = captains.map((captain) => {
      return captain._id;
    });

    const ride = await Ride.create({
      rider,
      pickupLocation,
      dropLocation,
      distance,
      status: "searching",
      availableCaptains,
    });

    await fetch(`${process.env.SOCKET_PORT}/emit-ride`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        captainIds: availableCaptains.map((id) => id.toString()),
        ride: {
          rideId: ride._id,
          rider: user.name,
          pickupLocation,
          dropLocation,
          distance,
        },
      }),
    });
    return NextResponse.json(
      {
        message: "Ride requested successfully, waiting for captain to accept",
        ride: {
          _id: ride._id,
          status: ride.status,
          pickupLocation: ride.pickupLocation,
          dropLocation: ride.dropLocation,
          distance: ride.distance,
          createdAt: ride.createdAt,
        },
        captainsNearby: captains,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in creating ride", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
