import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Vehicle } from "@/models/VehicleModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { vehicleFormSchema } from "@/validations/vehicleValidation";

const VALID_STATUS = ["active", "inactive"] as const;

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "captain") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const vehicles = await Vehicle.find({
      captain: session.user.id,
    }).select(
      "vehicleType vehicleModel vehicleColor vehicleNumber vehicleBrand isVerified status",
    );

    if (vehicles.length === 0) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, vehicles }, { status: 200 });
  } catch (error) {
    console.log("Garage Vehicle API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "captain") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { vehicleId, status } = await req.json();
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      captain: session.user.id,
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const activeVehicle = await Vehicle.findOne({
      captain: session.user.id,
      status: "active",
    });

    if (
      status === "active" &&
      activeVehicle &&
      activeVehicle._id.toString() !== vehicleId
    ) {
      return NextResponse.json(
        {
          message: "Another vehicle is already active. Deactivate it first.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `Vehicle status set as ${vehicle.status}`,
        vehicle: {
          _id: vehicle._id,
          status: vehicle.status,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Garage Vehicle Status Update API Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
