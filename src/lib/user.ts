import fs from "fs";
import path from "path";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

const DB_FILE = path.join(process.cwd(), "db.json");

// Read the entire database
export const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { users: [] };
  }
};

// Write to the database
export const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log("Database updated successfully");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
};

// Initialize users array
export let users: User[] = [];

// Function to load users
export const loadUsers = () => {
  try {
    const db = readDB();
    users = db.users;
    return users;
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

// Function to save users
export const saveUsers = (usersToSave: User[]) => {
  try {
    const db = readDB();
    db.users = usersToSave;
    writeDB(db);
    users = usersToSave;
    return true;
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

// Load users on module initialization
loadUsers();
