import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    // 1. Fetch public blogs and populate the author's name
    // Handle backward compatibility: check for both status field and is_published
    const blogs = await Blog.find({ 
      $or: [
        { status: 'PUBLISHED' },
        { status: { $exists: false }, is_published: true }
      ],
      is_archived: { $ne: true }
    })
      .populate("author_id", "name role bio social_links")
      .sort({ created_at: -1 });

    // 2. Format to match previous structure (appending author_name to the object)
    const formattedBlogs = blogs.map((blog: any) => {
      const author = blog.author_id
        ? {
            id: blog.author_id?._id?.toString?.() ?? "",
            name: blog.author_id?.name || "Unknown Author",
            role: blog.author_id?.role || null,
            bio: blog.author_id?.bio || null,
            social_links: blog.author_id?.social_links || {},
          }
        : null;

      return {
        ...blog.toObject(),
        author_name: author?.name || "Unknown Author",
        author,
      };
    });

    return NextResponse.json(formattedBlogs, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const { title, content, cover_image, category } = await request.json();
    const normalizedContent =
      typeof content === "string" ? content : JSON.stringify(content ?? { blocks: [] });

    // Simple Slugify: "My First Blog" -> "my-first-blog-[timestamp]"
    const slug =
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Date.now();

    const newBlog = await Blog.create({
      title,
      slug,
      content: normalizedContent,
      cover_image,
      category,
      author_id: session.user.id,
      status: 'PENDING', // Submit for admin approval
      is_published: false, // Keep for backward compatibility
    });

    return NextResponse.json(
      {
        message: "Blog created and pending approval!",
        blogId: newBlog._id,
        slug,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}