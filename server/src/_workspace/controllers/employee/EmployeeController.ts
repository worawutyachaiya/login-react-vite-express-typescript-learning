import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { EmployeeModel } from "@models/employee/EmployeeModel";
import { ResponseI } from "@src/types/ResponseI";
import {
  EmployeeFilterParams,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@_workspace/types/employee/Employee";

export const EmployeeController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const params: EmployeeFilterParams = {
        search: req.query.search as string,
        department_id: req.query.department_id
          ? Number(req.query.department_id)
          : undefined,
        position_id: req.query.position_id
          ? Number(req.query.position_id)
          : undefined,
        role: req.query.role as string,
        status: req.query.status as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const [employees, total] = await Promise.all([
        EmployeeModel.getAll(params),
        EmployeeModel.getCount(params),
      ]);

      res.status(200).json({
        Status: true,
        ResultOnDb: employees,
        TotalCountOnDb: total,
        MethodOnDb: "Get All Employees",
        Message: "Success",
      } as ResponseI);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: false, Message: "Server error" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const employee = await EmployeeModel.getById(id);

      if (!employee) {
        res.status(404).json({ Status: false, Message: "Employee not found" });
        return;
      }

      res.status(200).json({
        Status: true,
        ResultOnDb: employee,
        TotalCountOnDb: 1,
        MethodOnDb: "Get Employee By ID",
        Message: "Success",
      } as ResponseI);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: false, Message: "Server error" });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data: CreateEmployeeDTO = req.body;

      const emailExists = await EmployeeModel.checkEmailExists(data.email);
      if (emailExists) {
        res
          .status(409)
          .json({ Status: false, Message: "Email already exists" });
        return;
      }

      const empIdExists = await EmployeeModel.checkEmployeeIdExists(
        data.employee_id,
      );
      if (empIdExists) {
        res
          .status(409)
          .json({ Status: false, Message: "Employee ID already exists" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(data.password, salt);

      const insertId = await EmployeeModel.create({ ...data, password_hash });

      res.status(201).json({
        Status: true,
        ResultOnDb: { id: insertId },
        TotalCountOnDb: 1,
        MethodOnDb: "Create Employee",
        Message: "Employee created successfully",
      } as ResponseI);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: false, Message: "Server error" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data: UpdateEmployeeDTO = req.body;

      const employee = await EmployeeModel.getById(id);
      if (!employee) {
        res.status(404).json({ Status: false, Message: "Employee not found" });
        return;
      }

      if (data.employee_id) {
        const empIdExists = await EmployeeModel.checkEmployeeIdExists(
          data.employee_id,
          id,
        );
        if (empIdExists) {
          res
            .status(409)
            .json({ Status: false, Message: "Employee ID already exists" });
          return;
        }
      }

      await EmployeeModel.update(id, data);

      res.status(200).json({
        Status: true,
        ResultOnDb: null,
        TotalCountOnDb: 1,
        MethodOnDb: "Update Employee",
        Message: "Employee updated successfully",
      } as ResponseI);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: false, Message: "Server error" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const employee = await EmployeeModel.getById(id);
      if (!employee) {
        res.status(404).json({ Status: false, Message: "Employee not found" });
        return;
      }

      await EmployeeModel.delete(id);

      res.status(200).json({
        Status: true,
        ResultOnDb: null,
        TotalCountOnDb: 1,
        MethodOnDb: "Delete Employee",
        Message: "Employee deleted successfully",
      } as ResponseI);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Status: false, Message: "Server error" });
    }
  },
};
