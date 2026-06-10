import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/models/UserModel";
import { Captain } from "@/models/CaptainModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized request",
        },
        { status: 401 },
      );
    }

    let profile;

    if (session.user.role === "user") {
      const user = await User.findById(session.user.id).select(
        "name email phoneNumber createdAt",
      );

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 },
        );
      }

      profile = user;
    } else if (session.user.role === "captain") {
      const captain = await Captain.findById(session.user.id).select(
        "name email phoneNumber createdAt",
      );

      if (!captain) {
        return NextResponse.json(
          {
            success: false,
            message: "Captain not found",
          },
          { status: 404 },
        );
      }

      profile = captain;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Account profile API error", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
