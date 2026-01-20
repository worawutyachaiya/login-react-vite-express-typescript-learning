import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User {
  id?: number;
  employee_id?: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  department_id?: number;
  position_id?: number;
  role?: "ADMIN" | "HR" | "EMPLOYEE";
  status?: "ACTIVE" | "INACTIVE";
  hire_date?: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<number> {
    const { username, email, password_hash } = user;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password_hash],
    );
    return result.insertId;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }
}
