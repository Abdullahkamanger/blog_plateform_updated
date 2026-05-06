"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { hash } from "bcryptjs";

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = (formData.get("role") as string) || "READER";
  const bio = formData.get("bio") as string | null;

  if (!email || !password || !name) {
    return { error: "All fields are required." };
  }

  await connectDB();

  // 1. Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: "User already exists." };
  }

  // 2. Hash the password
  const hashedPassword = await hash(password, 10);

  // 3. Authors start as 'PENDING' for Admin approval
  const status = role === "AUTHOR" ? "PENDING" : "APPROVED";

  // 4. Create the new user
  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    status,
    bio,
  });

  return { success: true, message: "User registered successfully." };
}