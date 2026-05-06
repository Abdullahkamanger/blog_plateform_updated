import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authUtils";

export async function GET() {
  try {
    const session = await auth();
    if (!requireAdmin(session)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const pendingAuthors = await User.find({ role: "AUTHOR", status: "PENDING" }).select("-password");
    
    // Format to match frontend expectations
    const formatted = pendingAuthors.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
