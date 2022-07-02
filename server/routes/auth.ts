import { Router } from "express";
import { login, singUp, logout, googleAuth } from "../controllers/user";
const router = Router();

router.post("/singUp", singUp);

router.post("/login", login);

router.get("/logout", logout);

router.get("/google", googleAuth);

export default router;