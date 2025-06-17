export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

// Function to load users
export const loadUsers = async () => {
  try {
    const data = await fetch(`${baseUrl}/users`);
    const resData = await data.json();
    return resData;
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

// Function to save users
export const saveUsers = async (usersToSave: User) => {
  try {
    await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usersToSave),
    });
    await loadUsers();
    return true;
  } catch (error) {
    console.error("Error saving users:", error);
    throw error;
  }
};

export const updateUsers = async (usersToUpdate: User) => {
  try {
    await fetch(`${baseUrl}/users/${usersToUpdate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usersToUpdate),
    });
    await loadUsers(); // Assign the returned users array
    return true;
  } catch (error) {
    console.error("Error updating users:", error);
    throw error;
  }
};
