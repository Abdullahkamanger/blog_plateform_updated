import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Interaction from "@/models/Interaction";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    // 1. Get the session using the Auth.js session method
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Validate if userId is a valid MongoDB ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      // If it's not a valid ObjectId (e.g. GitHub ID not linked to DB), 
      // return empty array instead of 500 error
      return NextResponse.json([], { status: 200 });
    }

    await connectDB();

    // 2. Fetch interactions using the session's user ID
    const interactions = await Interaction.find({ user_id: userId });

    return NextResponse.json(interactions, { status: 200 });
  } catch (err: any) {
    console.error("Interactions Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}