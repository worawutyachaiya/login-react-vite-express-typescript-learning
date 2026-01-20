import { Router } from "express";
import { DepartmentService } from "@services/department/DepartmentService";
import { authMiddleware, requireRole } from "@middlewares/authMiddleware";
import { ResponseI } from "@src/types/ResponseI";

const DepartmentRoutes = Router();

DepartmentRoutes.use(authMiddleware);

DepartmentRoutes.get("/", async (req, res) => {
  try {
    const departments = await DepartmentService.getAll();
    res.json({
      Status: true,
      ResultOnDb: departments,
      TotalCountOnDb: departments.length,
      MethodOnDb: "Get All Departments",
      Message: "Success",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

DepartmentRoutes.get("/:id", async (req, res) => {
  try {
    const department = await DepartmentService.getById(Number(req.params.id));
    if (!department) {
      res.status(404).json({ Status: false, Message: "Department not found" });
      return;
    }
    res.json({
      Status: true,
      ResultOnDb: department,
      TotalCountOnDb: 1,
      MethodOnDb: "Get Department By ID",
      Message: "Success",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

DepartmentRoutes.post("/", requireRole("ADMIN", "HR"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ Status: false, Message: "Name is required" });
      return;
    }
    const id = await DepartmentService.create({ name, description });
    res.status(201).json({
      Status: true,
      ResultOnDb: { id },
      TotalCountOnDb: 1,
      MethodOnDb: "Create Department",
      Message: "Department created successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

DepartmentRoutes.put("/:id", requireRole("ADMIN", "HR"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const existing = await DepartmentService.getById(id);
    if (!existing) {
      res.status(404).json({ Status: false, Message: "Department not found" });
      return;
    }
    await DepartmentService.update(id, { name, description });
    res.json({
      Status: true,
      ResultOnDb: null,
      TotalCountOnDb: 1,
      MethodOnDb: "Update Department",
      Message: "Department updated successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

DepartmentRoutes.delete("/:id", requireRole("ADMIN"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await DepartmentService.getById(id);
    if (!existing) {
      res.status(404).json({ Status: false, Message: "Department not found" });
      return;
    }
    await DepartmentService.delete(id);
    res.json({
      Status: true,
      ResultOnDb: null,
      TotalCountOnDb: 1,
      MethodOnDb: "Delete Department",
      Message: "Department deleted successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

export default DepartmentRoutes;
