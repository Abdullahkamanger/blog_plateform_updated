import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authUtils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!requireAdmin(session)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const blog = await Blog.findById(id).populate("author_id", "name");

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const formatted = {
      ...blog.toObject(),
      author_name: blog.author_id?.name || "Unknown Author",
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
