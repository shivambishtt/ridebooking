import { NextRequest, NextResponse } from "next/server";
import { Vehicle } from "@/models/VehicleModel";
import connectDB from "@/lib/connectDB";
import { authOptions } from "../../[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const captainId = session?.user.id;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session?.user.role !== "captain") {
      return NextResponse.json({
        message: "Users are not authenticated to register the vehicle",
        status: 400,
      });
    }
    const {
      vehicleType,
      vehicleNumberPlate,
      vehicleBrand,
      vehicleColor,
      vehicleModel,
    } = await req.json();

    if (
      !vehicleType ||
      !vehicleNumberPlate ||
      !vehicleBrand ||
      !vehicleColor ||
      !vehicleModel
    ) {
      return NextResponse.json({
        message: "All fields are required to register vehicle",
        status: 400,
      });
    }

    const plateExists = await Vehicle.findOne({
      vehicleNumberPlate,
    });

    if (plateExists) {
      return NextResponse.json(
        { message: "Vehicle number plate already exists" },
        { status: 400 },
      );
    }

    const vehicleAlreadyRegistered = await Vehicle.findOne({
      captain: captainId,
    });

    if (vehicleAlreadyRegistered) {
      return NextResponse.json({
        message: "Vehicle with this ID is already registered",
        status: 401,
      });
    }

    const vehicle = await Vehicle.create({
      vehicleType,
      vehicleNumberPlate,
      vehicleBrand,
      vehicleColor,
      vehicleModel,
      captain: captainId,
      isVerified: false,
    });

    return NextResponse.json({
      vehicle,
      message: "Vehicle created successfully",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      message: "An unknown error occured",
      status: 500,
    });
  }
}
