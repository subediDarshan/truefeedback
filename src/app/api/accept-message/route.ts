import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { acceptMessage } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        {
          success: false,
          message: "Error getting session info",
        },
        { status: 500 }
      );
    }
    const userId = mongoose.Types.ObjectId.createFromHexString(
      session?.user._id
    );

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Error updating isAcceptingMessages field",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
        message: acceptMessage ? "Accepting messages" : "Not accepting messages",
      },
      { status: 201 }
    );
  } catch (error:unknown) {
    if(error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        {
          success: false,
          message: "Error getting session info",
        },
        { status: 500 }
      );
    }
    const userId = mongoose.Types.ObjectId.createFromHexString(
      session?.user._id
    );

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Problem getting message acceptance info",
      },
      { status: 500 }
    );
  }
}
