import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authUtils";

export async function GET() {
  try {
    const session = await auth();
    if (!requireAdmin(session)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const [usersCount, pendingAuthorsCount, blogsCount] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "AUTHOR", status: "PENDING" }),
      Blog.countDocuments({}),
    ]);

    return NextResponse.json({
      users: usersCount,
      pending: pendingAuthorsCount,
      blogs: blogsCount,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
