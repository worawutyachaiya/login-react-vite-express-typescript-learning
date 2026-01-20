import {
  EmployeeFilterParams,
  UpdateEmployeeDTO,
  CreateEmployeeDTO,
} from "@_workspace/types/employee/Employee";

export const EmployeeSQL = {
  getAll: (params: EmployeeFilterParams) => {
    const {
      search,
      department_id,
      position_id,
      role,
      status,
      page = 1,
      limit = 10,
    } = params;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        u.id,
        u.employee_id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.department_id,
        d.name as department_name,
        u.position_id,
        p.name as position_name,
        u.role,
        u.status,
        u.hire_date,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN positions p ON u.position_id = p.id
      WHERE 1=1
    `;

    const values: any[] = [];

    if (search) {
      sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.employee_id LIKE ?)`;
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (department_id) {
      sql += ` AND u.department_id = ?`;
      values.push(department_id);
    }

    if (position_id) {
      sql += ` AND u.position_id = ?`;
      values.push(position_id);
    }

    if (role) {
      sql += ` AND u.role = ?`;
      values.push(role);
    }

    if (status) {
      sql += ` AND u.status = ?`;
      values.push(status);
    }

    sql += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    return { sql, values };
  },

  getCount: (params: EmployeeFilterParams) => {
    const { search, department_id, position_id, role, status } = params;

    let sql = `SELECT COUNT(*) as total FROM users u WHERE 1=1`;
    const values: any[] = [];

    if (search) {
      sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.employee_id LIKE ?)`;
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (department_id) {
      sql += ` AND u.department_id = ?`;
      values.push(department_id);
    }

    if (position_id) {
      sql += ` AND u.position_id = ?`;
      values.push(position_id);
    }

    if (role) {
      sql += ` AND u.role = ?`;
      values.push(role);
    }

    if (status) {
      sql += ` AND u.status = ?`;
      values.push(status);
    }

    return { sql, values };
  },

  getById: (id: number) => {
    const sql = `
      SELECT 
        u.id,
        u.employee_id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.department_id,
        d.name as department_name,
        u.position_id,
        p.name as position_name,
        u.role,
        u.status,
        u.hire_date,
        u.created_at,
        u.updated_at
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN positions p ON u.position_id = p.id
      WHERE u.id = ?
    `;
    return { sql, values: [id] };
  },

  create: (data: CreateEmployeeDTO & { password_hash: string }) => {
    const sql = `
      INSERT INTO users 
        (employee_id, username, email, password_hash, first_name, last_name, phone, department_id, position_id, role, status, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.employee_id,
      data.username,
      data.email,
      data.password_hash,
      data.first_name,
      data.last_name,
      data.phone || null,
      data.department_id,
      data.position_id,
      data.role || "EMPLOYEE",
      data.status || "ACTIVE",
      data.hire_date || null,
    ];
    return { sql, values };
  },

  update: (id: number, data: UpdateEmployeeDTO) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.employee_id !== undefined) {
      fields.push("employee_id = ?");
      values.push(data.employee_id);
    }
    if (data.first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(data.last_name);
    }
    if (data.phone !== undefined) {
      fields.push("phone = ?");
      values.push(data.phone);
    }
    if (data.department_id !== undefined) {
      fields.push("department_id = ?");
      values.push(data.department_id);
    }
    if (data.position_id !== undefined) {
      fields.push("position_id = ?");
      values.push(data.position_id);
    }
    if (data.role !== undefined) {
      fields.push("role = ?");
      values.push(data.role);
    }
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.hire_date !== undefined) {
      fields.push("hire_date = ?");
      values.push(data.hire_date);
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    return { sql, values };
  },

  delete: (id: number) => {
    const sql = `UPDATE users SET status = 'INACTIVE' WHERE id = ?`;
    return { sql, values: [id] };
  },
};
