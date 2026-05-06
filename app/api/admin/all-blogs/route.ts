import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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
    const blogs = await Blog.find({})
      .populate("author_id", "name")
      .sort({ created_at: -1 });

    const formatted = blogs.map((blog: any) => ({
      id: blog._id,
      title: blog.title,
      author: blog.author_id?.name || "Unknown Author",
      is_published: blog.is_published,
      image: blog.cover_image,
      category: blog.category,
      date: blog.created_at,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}