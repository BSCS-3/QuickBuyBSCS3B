import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUsersByRole,
} from "../controllers/userController";

const router = express.Router();

// POST /api/register will use the registerUser contrller
// http://localhost:3000/api FOR POSTMAN
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getAllUsers);
router.get("/users/:role", getUsersByRole);

export default router;
