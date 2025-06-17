import { NextResponse } from "next/server";
import { User, updateUsers, loadUsers } from "@/lib/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();
    const users = await loadUsers();
    // Find user
    const userIndex = users.findIndex((user: User) => user.email === email);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate salt and hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    const prevUser = users[userIndex];
    if (!prevUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const updatedUser: User = {
      id: prevUser.id,
      name: prevUser.name,
      email: prevUser.email,
      avatar: prevUser.avatar,
      password: hashedPassword,
    };

    try {
      // Update in users array and save
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      await updateUsers(updatedUser);

      return NextResponse.json({
        message: "Password updated successfully",
      });
    } catch (saveError) {
      console.error("Error saving password update:", saveError);
      return NextResponse.json(
        { error: "Failed to save password update" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
