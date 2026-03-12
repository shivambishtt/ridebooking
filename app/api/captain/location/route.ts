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

    const { longitude, latitude } = await req.json();
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
        isAvailable: true,
      },
      {
        new: true,
      },
    );
    return NextResponse.json({
      message: "Location updated. You are live now",
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
