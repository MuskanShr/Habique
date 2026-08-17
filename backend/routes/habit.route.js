import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
  checkInHabit,
  undoCheckInHabit,
} from "../controllers/habit.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getHabits);
router.post("/", createHabit);

router.get("/:id", getHabitById);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

router.post("/:id/checkin", checkInHabit);
router.post("/:id/undo-checkin", undoCheckInHabit);

export default router;
