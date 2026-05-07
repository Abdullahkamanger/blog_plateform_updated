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

    const existing = await Interaction.findOne({
      user_id: userId,
      blog_id: blogId,
      type: "SAVE",
    });

    if (existing) {
      await Interaction.deleteOne({ _id: existing._id });
      await Blog.findByIdAndUpdate(blogId, { $inc: { saves_count: -1 } });
      const updatedBlog = await Blog.findById(blogId);

      return NextResponse.json({
        message: "Unsaved",
        saves_count: updatedBlog?.saves_count,
      });
    } else {
      await Interaction.create({
        user_id: userId,
        blog_id: blogId,
        type: "SAVE",
      });
      await Blog.findByIdAndUpdate(blogId, { $inc: { saves_count: 1 } });
      const updatedBlog = await Blog.findById(blogId);

      return NextResponse.json({
        message: "Saved",
        saves_count: updatedBlog?.saves_count,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}