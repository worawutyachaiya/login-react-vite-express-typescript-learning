export interface EmployeeI {
  id: number;
  employee_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  department_id: number;
  department_name?: string;
  position_id: number;
  position_name?: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
  hire_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeDTO {
  employee_id: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  department_id: number;
  position_id: number;
  role?: "ADMIN" | "HR" | "EMPLOYEE";
  status?: "ACTIVE" | "INACTIVE";
  hire_date?: string;
}

export interface UpdateEmployeeDTO {
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department_id?: number;
  position_id?: number;
  role?: "ADMIN" | "HR" | "EMPLOYEE";
  status?: "ACTIVE" | "INACTIVE";
  hire_date?: string;
}

export interface EmployeeFilterParams {
  search?: string;
  department_id?: number;
  position_id?: number;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}
