import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    // Find the published blog
    const publishedBlog = await Blog.findOne({
      _id: id,
      author_id: userId,
      status: 'PUBLISHED',
      is_archived: false,
    });

    if (!publishedBlog) {
      return NextResponse.json({ error: "Published blog not found" }, { status: 404 });
    }

    // Check if there's already an active draft for this blog
    const existingDraft = await Blog.findOne({
      parent_blog_id: id,
      author_id: userId,
      status: 'DRAFT',
      is_archived: false,
    });

    if (existingDraft) {
      return NextResponse.json(
        { 
          message: "Draft already exists for this blog",
          draftId: existingDraft._id 
        },
        { status: 200 }
      );
    }

    // Create a new draft based on the published blog
    const draftSlug =
      publishedBlog.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-draft-" +
      Date.now();

    const newDraft = await Blog.create({
      title: publishedBlog.title,
      slug: draftSlug,
      content: publishedBlog.content,
      cover_image: publishedBlog.cover_image,
      category: publishedBlog.category,
      author_id: session.user.id,
      status: 'DRAFT',
      is_published: false,
      parent_blog_id: publishedBlog._id,
    });

    return NextResponse.json(
      {
        message: "Draft created successfully!",
        draftId: newDraft._id,
        slug: draftSlug,
        originalBlogId: publishedBlog._id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
