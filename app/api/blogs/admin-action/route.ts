import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser, requireAuthor } from "@/lib/authUtils";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the session
    const session = await getSessionUser();
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "No token provided / Unauthorized" }, { status: 401 });
    }

    // 2. Use our authorization check
    if (!requireAuthor(session)) {
      return NextResponse.json(
        { message: "Access denied. Author account pending or restricted." },
        { status: 403 }
      );
    }

    await connectDB();
    
    // 3. Perform your actual route logic here...
    // const body = await request.json();
    
    return NextResponse.json({ message: "Action permitted and completed successfully!" });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}