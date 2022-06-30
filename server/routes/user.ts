import express from 'express'
import { login, singUp } from "../controllers/user"
const router = express.Router()


router.post('/singUp', singUp)
router.post('/Login', login)



export default router