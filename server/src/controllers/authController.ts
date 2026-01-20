import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // Validation
      if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Check if user exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user
      const userId = await UserModel.create({
        username,
        email,
        password_hash,
      });

      res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role || "EMPLOYEE" },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" },
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || "EMPLOYEE",
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { password_hash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
