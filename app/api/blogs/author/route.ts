import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
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
    
    // Get all posts by the author (excluding archived)
    const blogs = await Blog.find({ 
      author_id: userId,
      is_archived: false 
    })
      .populate("author_id", "name role bio social_links")
      .sort({ last_saved_at: -1 });

    // Format posts with author information
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
