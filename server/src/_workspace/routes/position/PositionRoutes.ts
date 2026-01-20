import { Router } from "express";
import { PositionService } from "@services/position/PositionService";
import { authMiddleware, requireRole } from "@middlewares/authMiddleware";
import { ResponseI } from "@src/types/ResponseI";

const PositionRoutes = Router();

PositionRoutes.use(authMiddleware);

PositionRoutes.get("/", async (req, res) => {
  try {
    const positions = await PositionService.getAll();
    res.json({
      Status: true,
      ResultOnDb: positions,
      TotalCountOnDb: positions.length,
      MethodOnDb: "Get All Positions",
      Message: "Success",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

PositionRoutes.get("/:id", async (req, res) => {
  try {
    const position = await PositionService.getById(Number(req.params.id));
    if (!position) {
      res.status(404).json({ Status: false, Message: "Position not found" });
      return;
    }
    res.json({
      Status: true,
      ResultOnDb: position,
      TotalCountOnDb: 1,
      MethodOnDb: "Get Position By ID",
      Message: "Success",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

PositionRoutes.post("/", requireRole("ADMIN", "HR"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ Status: false, Message: "Name is required" });
      return;
    }
    const id = await PositionService.create({ name, description });
    res.status(201).json({
      Status: true,
      ResultOnDb: { id },
      TotalCountOnDb: 1,
      MethodOnDb: "Create Position",
      Message: "Position created successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

PositionRoutes.put("/:id", requireRole("ADMIN", "HR"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const existing = await PositionService.getById(id);
    if (!existing) {
      res.status(404).json({ Status: false, Message: "Position not found" });
      return;
    }
    await PositionService.update(id, { name, description });
    res.json({
      Status: true,
      ResultOnDb: null,
      TotalCountOnDb: 1,
      MethodOnDb: "Update Position",
      Message: "Position updated successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

PositionRoutes.delete("/:id", requireRole("ADMIN"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await PositionService.getById(id);
    if (!existing) {
      res.status(404).json({ Status: false, Message: "Position not found" });
      return;
    }
    await PositionService.delete(id);
    res.json({
      Status: true,
      ResultOnDb: null,
      TotalCountOnDb: 1,
      MethodOnDb: "Delete Position",
      Message: "Position deleted successfully",
    } as ResponseI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

export default PositionRoutes;
