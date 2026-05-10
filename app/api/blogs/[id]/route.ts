import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Blog ID" }, { status: 400 });
    }

    await connectDB();

    const blog = await Blog.findOne({
      _id: id,
      status: 'PUBLISHED',
      is_archived: { $ne: true },
    }).populate("author_id", "name role bio social_links");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const author = blog.author_id
      ? {
          id: blog.author_id?._id?.toString?.() ?? "",
          name: blog.author_id?.name || "Unknown Author",
          role: blog.author_id?.role || null,
          bio: blog.author_id?.bio || null,
          social_links: blog.author_id?.social_links || {},
        }
      : null;

    const formattedBlog = {
      ...blog.toObject(),
      author_name: author?.name || "Unknown Author",
      author,
    };

    return NextResponse.json(formattedBlog, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}