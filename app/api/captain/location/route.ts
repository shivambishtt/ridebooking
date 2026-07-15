import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { Captain } from "@/models/CaptainModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "captain") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { longitude, latitude, isAvailable } = await req.json();
    if (!longitude || !latitude) {
      return NextResponse.json(
        { message: "Location required" },
        { status: 400 },
      );
    }

    const captain = await Captain.findByIdAndUpdate(
      session.user.id,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        isAvailable: isAvailable,
      },
      {
        new: true,
      },
    );
    return NextResponse.json({
      message: isAvailable
        ? "Location updated. You are live now"
        : "You are now offline 💤",
      captain,
    });
  } catch (error) {
    console.error("Location API error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "captain") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const captain = await Captain.findById(session.user.id)
      .populate("vehicle")
      .select("isAvailable vehicle");

    if (!captain) {
      return NextResponse.json(
        { message: "Captain not found" },
        { status: 404 },
      );
    }

    if (!captain.vehicle) {
      return NextResponse.json(
        { message: "No vehicle selected" },
        { status: 404 },
      );
    }

    if (captain.vehicle.status !== "active") {
      return NextResponse.json(
        { message: "Please select an active vehicle" },
        { status: 400 },
      );
    }

    return NextResponse.json({ isAvailable: captain.isAvailable });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
