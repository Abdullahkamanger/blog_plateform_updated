import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authUtils";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!requireAdmin(session)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    await connectDB();
    
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query).select("-password").sort({ created_at: -1 });

    const formatted = users.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
