import { Router } from "express";
import { z } from "zod";
import { EmployeeController } from "@controllers/employee/EmployeeController";
import { authMiddleware, requireRole } from "@middlewares/authMiddleware";

const EmployeeRoutes = Router();

const createEmployeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  department_id: z.number().int().positive("Invalid department"),
  position_id: z.number().int().positive("Invalid position"),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  hire_date: z.string().optional(),
});

const updateEmployeeSchema = z.object({
  employee_id: z.string().min(1).optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  department_id: z.number().int().positive().optional(),
  position_id: z.number().int().positive().optional(),
  role: z.enum(["ADMIN", "HR", "EMPLOYEE"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  hire_date: z.string().optional(),
});

const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          Status: false,
          Message: "Validation error",
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  };
};

// All routes require authentication
EmployeeRoutes.use(authMiddleware);

// GET /api/employees - Get all employees (HR, ADMIN)
EmployeeRoutes.get("/", requireRole("HR", "ADMIN"), EmployeeController.getAll);

// GET /api/employees/:id - Get employee by ID (HR, ADMIN, or self)
EmployeeRoutes.get("/:id", EmployeeController.getById);

// POST /api/employees - Create employee (HR, ADMIN only)
EmployeeRoutes.post(
  "/",
  requireRole("HR", "ADMIN"),
  validateBody(createEmployeeSchema),
  EmployeeController.create,
);

// PUT /api/employees/:id - Update employee (HR, ADMIN only)
EmployeeRoutes.put(
  "/:id",
  requireRole("HR", "ADMIN"),
  validateBody(updateEmployeeSchema),
  EmployeeController.update,
);

// DELETE /api/employees/:id - Delete employee (ADMIN only)
EmployeeRoutes.delete("/:id", requireRole("ADMIN"), EmployeeController.delete);

export default EmployeeRoutes;
