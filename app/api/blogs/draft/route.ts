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
    const { title, content, cover_image, category, blogId } = await request.json();
    
    const normalizedContent =
      typeof content === "string" ? content : JSON.stringify(content ?? { blocks: [] });

    if (blogId) {
      // Update existing draft
      const existingDraft = await Blog.findOne({
        _id: blogId,
        author_id: userId,
        status: 'DRAFT'
      });

      if (!existingDraft) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
      }

      existingDraft.title = title || existingDraft.title;
      existingDraft.content = normalizedContent;
      existingDraft.cover_image = cover_image || existingDraft.cover_image;
      existingDraft.category = category || existingDraft.category;
      existingDraft.last_saved_at = new Date();

      await existingDraft.save();

      return NextResponse.json(
        {
          message: "Draft updated successfully!",
          blogId: existingDraft._id,
        },
        { status: 200 }
      );
    } else {
      // Create new draft
      if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }

      // Simple Slugify: "My First Blog" -> "my-first-blog-[timestamp]"
      const slug =
        title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        Date.now();

      const newDraft = await Blog.create({
        title,
        slug,
        content: normalizedContent,
        cover_image,
        category,
        author_id: session.user.id,
        status: 'DRAFT',
        is_published: false,
      });

      return NextResponse.json(
        {
          message: "Draft saved successfully!",
          blogId: newDraft._id,
          slug,
        },
        { status: 201 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
