// The purpose of This User Controller, is to Validate the inputs that the user register.
import { RowDataPacket } from "mysql2/promise";
import { Request, Response, RequestHandler } from "express";
import { Session } from "express-session";
import bcrypt from "bcryptjs";
import pool from "../models/db";

// User Interface
interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: string;
  shop_name: string;
}

// Extend Request type to include session
interface RequestWithSession extends Request {
  session: Session & {
    userId?: number;
    role?: string;
    destroy(callback: (error: Error | null) => void): void;
  };
}

// Registration Controller
export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const { username, email, password, role, shop_name } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password || !role) {
    res.status(400).json({ message: "All fields are required!" });
    return;
  }

  // Validate role (only allow customer or seller)
  if (role !== "customer" && role !== "seller") {
    res.status(400).json({ message: "Invalid role selected" });
    return;
  }

  if (role === "seller" && !shop_name) {
    res.status(400).json({ message: "Shop name is required for sellers" });
    return;
  }

  // Basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Check for password strength
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  try {
    // Ensure that sellers provide a shop_name
    if (role === "seller" && (!shop_name || shop_name.trim() === "")) {
      res.status(400).json({ message: "Shop name is required for sellers" });
    }

    // Check if email, username, or shop_name (for sellers) already exists
    const [rows] = await pool.query<RowDataPacket[] & User[]>(
      role === "seller"
        ? "SELECT email, username, shop_name FROM users WHERE email = ? OR username = ? OR shop_name = ?"
        : "SELECT email, username FROM users WHERE email = ? OR username = ?",
      role === "seller" ? [email, username, shop_name] : [email, username]
    );

    if (rows.length > 0) {
      if (rows.some((user) => user.email === email)) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      if (rows.some((user) => user.username === username)) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }
      if (
        role === "seller" &&
        rows.some((user) => user.shop_name === shop_name)
      ) {
        res.status(400).json({ message: "Shop name already exists" });
        return;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const query =
      "INSERT INTO users (username, email, password, role, shop_name) VALUES (?, ?, ?, ?, ?)";
    await pool.query(query, [
      username,
      email,
      hashedPassword,
      role,
      role === "seller" ? shop_name : null,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
export const loginUser = async (req: RequestWithSession, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[] & User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Set session data
    req.session.userId = user.id;
    req.session.role = user.role;

    // Save session
    req.session.save((err) => {
      if (err) {
        res.status(500).json({ message: "Error creating session" });
        return;
      }

      res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Logout Controller
export const logoutUser = (req: RequestWithSession, res: Response) => {
  try {
    req.session.destroy((error: Error | null) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Could not log out, please try again" });
        return;
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// Getting all the users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[] & User[]>(
      "SELECT id, username, email, role FROM users"
    );
    res.json({ users: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while retrieving users! " });
  }
};

export const getUsersByRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.params; // Extract the role from URL params

    // Execute the SQL query to fetch users with the specified role
    const [rows] = await pool.query<RowDataPacket[] & User[]>(
      "SELECT id, username, email, role FROM users WHERE role = ?",
      [role] // Parameterized query to prevent SQL injection
    );

    // Check if users exist with the given role
    if (rows.length === 0) {
      res.status(404).json({ message: `No users found with role: ${role}` });
      return; // Ensure function exits after sending a response
    }

    // Send the filtered users as JSON
    res.json({ users: rows });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res
      .status(500)
      .json({ message: "Server error while retrieving users by role." });
  }
};
