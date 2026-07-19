import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Vehicle } from "@/models/VehicleModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const vehicle = await Vehicle.findOne({
      captain: session.user.id,
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, vehicle }, { status: 200 });
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

    const vehicle = await Vehicle.findOne({
      captain: session.user.id,
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const { status } = await req.json();
    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    if (vehicle.status !== status) {
      vehicle.status = status;
      await vehicle.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: `Vehicle status set as ${vehicle.status}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Garage Vehicle Status Update API Error:", error);
    return NextResponse.json(
      {
        message: " Internal Server Error",
        error,
      },
      { status: 500 },
    );
  }
}
