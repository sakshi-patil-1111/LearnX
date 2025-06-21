import express from "express";
import { loginOrRegister } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js"; 

const router = express.Router();

router.post("/verify", authUser, loginOrRegister);

export default router;
