import { NextRequest, NextResponse } from "next/server";
import { Vehicle } from "@/models/VehicleModel";
import connectDB from "@/lib/connectDB";
import validNumberPlate from "@/lib/validNumberPlate";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const captainId = session?.user.id;

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized. Please signin first" },
        { status: 401 },
      );
    }
    if (session?.user.role !== "captain") {
      return NextResponse.json(
        {
          message: "User not authenticated to register the vehicle",
        },
        { status: 400 },
      );
    }

    const {
      vehicleType,
      vehicleNumber,
      vehicleBrand,
      vehicleColor,
      vehicleModel,
    } = await req.json();

    if (
      !vehicleType ||
      !vehicleNumber ||
      !vehicleBrand ||
      !vehicleColor ||
      !vehicleModel
    ) {
      return NextResponse.json(
        {
          message: "All fields are required to register vehicle",
        },
        { status: 400 },
      );
    }

    if (!validNumberPlate(vehicleNumber)) {
      return NextResponse.json(
        { message: "Invalid vehicle number plate format" },
        { status: 400 },
      );
    }

    const plateExists = await Vehicle.findOne({
      vehicleNumber,
    });

    if (plateExists) {
      return NextResponse.json(
        { message: "Vehicle number plate already exists" },
        { status: 400 },
      );
    }

    const vehicle = await Vehicle.create({
      vehicleType,
      vehicleNumber,
      vehicleBrand,
      vehicleColor,
      vehicleModel,
      captain: captainId,
      isVerified: true,
      status: "inactive",
    });

    return NextResponse.json(
      {
        vehicle,
        message: "Vehicle created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Vehicle API Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
