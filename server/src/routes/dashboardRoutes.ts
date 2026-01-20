import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/stats", async (req, res) => {
  try {
    const [empCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM users",
    );
    const [activeCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM users WHERE status = 'ACTIVE' OR status IS NULL",
    );
    const [deptCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM departments",
    );
    const [posCount] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM positions",
    );

    const totalEmployees = empCount[0]?.total || 0;
    const activeEmployees = activeCount[0]?.total || 0;
    const activeRate =
      totalEmployees > 0
        ? Math.round((activeEmployees / totalEmployees) * 100)
        : 0;

    res.json({
      Status: true,
      ResultOnDb: {
        totalEmployees,
        departments: deptCount[0]?.total || 0,
        positions: posCount[0]?.total || 0,
        activeRate,
      },
      Message: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Message: "Server error" });
  }
});

export default dashboardRoutes;
