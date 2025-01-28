import dbConnect from "@/lib/dbConnect";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    if (!google) {
      return NextResponse.json(
        {
          success: false,
          message: "google client not created",
        },
        {
          status: 500,
        }
      );
    }

    const prompt =
      'Create an object having field messages which is an array of three open-ended and engaging questions. These questions are for an anonymous social messaging platform, like Qooh.me. For example, your output should be structured like this: {"messages": ["If you could have dinner with any historical figure, who would it be?", "What’s a simple thing that makes you happy?"]}';

    const { object } = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: z.object({
        messages: z.array(z.string()),
      }),
      prompt,
    });

    if (!object) {
      return NextResponse.json(
        {
          success: false,
          message: "problem creating text",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Messages suggestion success",
        data: object,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Messages suggestion failed",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
