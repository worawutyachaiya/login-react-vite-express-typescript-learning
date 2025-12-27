import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<number> {
    const { username, email, password_hash } = user;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password_hash]
    );
    return result.insertId;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }
}
