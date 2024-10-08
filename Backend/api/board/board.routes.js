import express from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware.js";
import {
  deleteBoard,
  getBoard,
  getBoards,
  getTask,
  postBoard,
  putBoard,
} from "./board.controller.js";

const router = express.Router();

router.get("/", getBoards);
router.get("/:boardId", getBoard);
router.get("/t/:taskId",getTask)
router.post("/", requireAuth, postBoard);
router.put("/", requireAuth, putBoard);
router.delete("/:boardId", requireAuth, deleteBoard);

export const boardRouter = router;
