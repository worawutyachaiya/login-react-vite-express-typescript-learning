import pool from "@config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const PositionService = {
  getAll: async () => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, description, created_at, updated_at FROM positions ORDER BY name",
    );
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, description, created_at, updated_at FROM positions WHERE id = ?",
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (data: { name: string; description?: string }) => {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO positions (name, description) VALUES (?, ?)",
      [data.name, data.description || null],
    );
    return result.insertId;
  },

  update: async (id: number, data: { name?: string; description?: string }) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }

    if (fields.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE positions SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows;
  },

  delete: async (id: number) => {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM positions WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  },
};
