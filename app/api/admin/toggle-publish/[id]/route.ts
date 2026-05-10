import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/authUtils";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!requireAdmin(session)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    // Determine new status based on input
    const newStatus = status === true ? 'PUBLISHED' : 'DRAFT';
    
    await connectDB();
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { 
        status: newStatus,
        is_published: newStatus === 'PUBLISHED' // Keep in sync for compatibility
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Blog status updated to ${newStatus}`,
      status: newStatus 
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
