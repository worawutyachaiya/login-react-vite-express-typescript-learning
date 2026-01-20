import { EmployeeService } from "@services/employee/EmployeeService";
import {
  EmployeeFilterParams,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@_workspace/types/employee/Employee";

export const EmployeeModel = {
  getAll: async (params: EmployeeFilterParams) =>
    EmployeeService.getAll(params),
  getCount: async (params: EmployeeFilterParams) =>
    EmployeeService.getCount(params),
  getById: async (id: number) => EmployeeService.getById(id),
  create: async (data: CreateEmployeeDTO & { password_hash: string }) =>
    EmployeeService.create(data),
  update: async (id: number, data: UpdateEmployeeDTO) =>
    EmployeeService.update(id, data),
  delete: async (id: number) => EmployeeService.delete(id),
  checkEmailExists: async (email: string, excludeId?: number) =>
    EmployeeService.checkEmailExists(email, excludeId),
  checkEmployeeIdExists: async (empId: string, excludeId?: number) =>
    EmployeeService.checkEmployeeIdExists(empId, excludeId),
};
