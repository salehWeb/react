import { Router } from "express";
import { login, singUp, logout } from "../controllers/user";
const router = Router();

router.post("/singUp", singUp);

router.post("/login", login);

router.get("/logout", logout);

export default router;