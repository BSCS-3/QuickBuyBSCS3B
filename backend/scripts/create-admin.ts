import bcrypt from "bcryptjs";
import pool from "../src/models/db";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

async function createAdminUser() {
  console.log("\n=== Create Admin Account ===\n");

  // Prompt for admin credentials
  const username = prompt("Enter admin username: ");
  const email = prompt("Enter admin email: ");
  const password = prompt("Enter admin password: ", { echo: "*" });
  const confirmPassword = prompt("Confirm admin password: ", { echo: "*" });

  // Validate inputs
  if (!username || !email || !password) {
    console.error("All fields are required!");
    return;
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format!");
    return;
  }

  // Validate password
  if (password.length < 8) {
    console.error("Password must be at least 8 characters long!");
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    console.error("Passwords do not match!");
    return;
  }

  const adminData = {
    username,
    email,
    password,
    role: "admin",
  };

  try {
    // Check if admin already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [adminData.email, adminData.username]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.error(
        "\nError: Admin user with this username or email already exists"
      );
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Insert admin user
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [adminData.username, adminData.email, hashedPassword, adminData.role]
    );

    console.log("\nAdmin user created successfully!");
    console.log("Username:", adminData.username);
    console.log("Email:", adminData.email);
  } catch (error) {
    console.error("\nError creating admin user:", error);
  } finally {
    await pool.end();
  }
}

// Run the function
console.log("\nPress Ctrl+C to cancel at any time");
createAdminUser();
