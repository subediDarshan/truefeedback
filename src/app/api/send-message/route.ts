import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, content } = await req.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User is currently not accepting messages",
        },
        { status: 400 }
      );
    }

    const message = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(message as Message);
    user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}
