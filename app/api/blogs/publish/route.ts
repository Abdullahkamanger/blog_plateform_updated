import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    await connectDB();
    const { blogId } = await request.json();

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      author_id: userId,
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.status === 'PUBLISHED') {
      return NextResponse.json({ error: "Blog is already published" }, { status: 400 });
    }

    if (blog.status === 'PENDING') {
      return NextResponse.json({ error: "Blog is already pending approval" }, { status: 400 });
    }

    // Update status to pending
    blog.status = 'PENDING';
    blog.last_saved_at = new Date();
    await blog.save();

    return NextResponse.json(
      {
        message: blog.parent_blog_id 
          ? "Blog update submitted for admin approval!" 
          : "Blog submitted for admin approval!",
        blogId: blog._id,
        isUpdate: !!blog.parent_blog_id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
