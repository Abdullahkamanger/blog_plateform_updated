import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import Interaction from "@/models/Interaction";
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

    const { id: blogId } = await params;
    const userId = session.user.id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json({ error: "Invalid Blog ID" }, { status: 400 });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if user already disliked it - if so, remove the dislike first
    const existingDislike = await Interaction.findOne({
      user_id: userId,
      blog_id: blogId,
      type: "DISLIKE",
    });

    if (existingDislike) {
      await Interaction.deleteOne({ _id: existingDislike._id });
      await Blog.findByIdAndUpdate(blogId, { $inc: { dislikes_count: -1 } });
    }

    // 2. Now handle the like logic
    const existingLike = await Interaction.findOne({
      user_id: userId,
      blog_id: blogId,
      type: "LIKE",
    });

    if (existingLike) {
      // Unlike and decrement count
      await Interaction.deleteOne({ _id: existingLike._id });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likes_count: -1 } });
      const updatedBlog = await Blog.findById(blogId);
      
      return NextResponse.json({
        message: "Unliked",
        likes_count: updatedBlog?.likes_count,
        dislikes_count: updatedBlog?.dislikes_count,
      });
    } else {
      // Like and increment count
      await Interaction.create({
        user_id: userId,
        blog_id: blogId,
        type: "LIKE",
      });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likes_count: 1 } });
      const updatedBlog = await Blog.findById(blogId);

      return NextResponse.json({
        message: "Liked",
        likes_count: updatedBlog?.likes_count,
        dislikes_count: updatedBlog?.dislikes_count,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}