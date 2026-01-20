import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.get("/me", authMiddleware, AuthController.getMe);

export default router;
