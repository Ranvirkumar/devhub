import { NextResponse } from "next/server";
import { loadUsers, saveUsers, User } from "@/lib/user";
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
    const { name, email, password } = await request.json();
    const users = await loadUsers();
    // Check if user already exists
    if (users.some((user: User) => user.email === email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with string ID to match existing structure
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
      avatar: `https://randomuser.me/api/portraits/${
        users.length % 2 ? "women" : "men"
      }/${users.length + 1}.jpg`,
    };

    try {
      // Add to users array and save
      await saveUsers(newUser);

      // Return user data (excluding password)
      const userWithoutPassword = { ...newUser } as UserWithOptionalPassword;
      delete userWithoutPassword.password;
      return NextResponse.json({
        user: userWithoutPassword,
        token: "mock-jwt-token", // In a real app, generate a proper JWT
      });
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return NextResponse.json(
        { error: "Failed to save user data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
