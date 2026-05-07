import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Blog ID" }, { status: 400 });
    }

    await connectDB();

    const blog = await Blog.findOne({
      _id: id,
      author_id: userId,
      is_archived: true,
    });

    if (!blog) {
      return NextResponse.json({ error: "Archived blog not found" }, { status: 404 });
    }

    // Restore the blog
    blog.is_archived = false;
    blog.last_saved_at = new Date();
    await blog.save();

    return NextResponse.json(
      {
        message: "Blog restored successfully!",
        blogId: blog._id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
