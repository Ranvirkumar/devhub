import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { User } from "@/lib/user";

const DB_FILE = path.join(process.cwd(), "db.json");

// Read the entire database
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { users: [] };
  }
};

// Write to the database
const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log("Database updated successfully");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
};

// Get all users
export async function GET() {
  const db = readDB();
  return NextResponse.json(db.users);
}

// Update users
export async function POST(request: Request) {
  try {
    const newUsers = await request.json();
    const db = readDB();
    db.users = newUsers;
    writeDB(db);
    return NextResponse.json({ success: true, count: newUsers.length });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Failed to save users" },
      { status: 500 }
    );
  }
}
