import { NextResponse } from "next/server";
import { users } from "@/lib/user";
import bcrypt from "bcryptjs";

export type UserWithOptionalPassword = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
};

export async function POST(request: Request) {
  try {
    const { email, password: userPassword } = await request.json();

    // Check if user exists
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check password against user's hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Return user data (excluding password)
    const userWithoutPassword = { ...user } as UserWithOptionalPassword;
    delete userWithoutPassword.password;

    // Return user data and mock token
    const token = "mock-jwt-token";
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Sign in error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
