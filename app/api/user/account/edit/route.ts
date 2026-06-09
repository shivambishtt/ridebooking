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
    if (!session?.user) {
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

    let currentUser;

    if (session.user.role === "user") {
      currentUser = await User.findById(session.user.id);
    } else {
      currentUser = await Captain.findById(session.user.id);
    }

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedData: Record<string, string> = {};

    if (email && email !== currentUser.email) {
      const [existingUser, existingCaptain] = await Promise.all([
        User.findOne({
          email,
          _id: {
            $ne: session.user.id,
          },
        }),
        Captain.findOne({
          email,
          _id: {
            $ne: session.user.id,
          },
        }),
      ]);
      if (existingUser || existingCaptain) {
        return NextResponse.json(
          {
            success: false,
            message: "Email is already taken by another user",
          },
          { status: 400 },
        );
      }
    }
    if (phoneNumber && phoneNumber !== currentUser.phoneNumber) {
      const [checkUser, checkCaptain] = await Promise.all([
        User.findOne({
          phoneNumber,
          _id: {
            $ne: session.user.id,
          },
        }),
        Captain.findOne({
          phoneNumber,
          _id: {
            $ne: session.user.id,
          },
        }),
      ]);

      if (checkUser || checkCaptain) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone number is already taken by another user",
          },
          { status: 400 },
        );
      }
    }

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
