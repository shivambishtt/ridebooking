import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { User } from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Captain } from "@/models/CaptainModel";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 },
      );
    }

    const { name, email, phoneNumber } = await req.json();
    if (!name && !email && !phoneNumber) {
      return NextResponse.json(
        {
          message: "At least one field is required",
        },
        { status: 400 },
      );
    }

    const updatedData: Record<string, string> = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;

    let updatedUser;

    if (session.user.role === "user") {
      updatedUser = await User.findByIdAndUpdate(session.user.id, updatedData, {
        new: true,
      });
    } else {
      updatedUser = await Captain.findByIdAndUpdate(
        session.user.id,
        updatedData,
        {
          new: true,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile Updated Successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Account details edit API error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
