import pool from "@config/db";
import { EmployeeSQL } from "@sql/employee/EmployeeSQL";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  EmployeeFilterParams,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@_workspace/types/employee/Employee";

export const EmployeeService = {
  getAll: async (params: EmployeeFilterParams) => {
    const { sql, values } = EmployeeSQL.getAll(params);
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows;
  },

  getCount: async (params: EmployeeFilterParams) => {
    const { sql, values } = EmployeeSQL.getCount(params);
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return (rows[0] as any).total;
  },

  getById: async (id: number) => {
    const { sql, values } = EmployeeSQL.getById(id);
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (data: CreateEmployeeDTO & { password_hash: string }) => {
    const { sql, values } = EmployeeSQL.create(data);
    const [result] = await pool.query<ResultSetHeader>(sql, values);
    return result.insertId;
  },

  update: async (id: number, data: UpdateEmployeeDTO) => {
    const { sql, values } = EmployeeSQL.update(id, data);
    const [result] = await pool.query<ResultSetHeader>(sql, values);
    return result.affectedRows;
  },

  delete: async (id: number) => {
    const { sql, values } = EmployeeSQL.delete(id);
    const [result] = await pool.query<ResultSetHeader>(sql, values);
    return result.affectedRows;
  },

  checkEmailExists: async (email: string, excludeId?: number) => {
    let sql = "SELECT id FROM users WHERE email = ?";
    const values: any[] = [email];

    if (excludeId) {
      sql += " AND id != ?";
      values.push(excludeId);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows.length > 0;
  },

  checkEmployeeIdExists: async (employeeId: string, excludeId?: number) => {
    let sql = "SELECT id FROM users WHERE employee_id = ?";
    const values: any[] = [employeeId];

    if (excludeId) {
      sql += " AND id != ?";
      values.push(excludeId);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows.length > 0;
  },
};
