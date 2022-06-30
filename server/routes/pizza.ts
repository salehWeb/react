import { getPizza } from '../controllers/pizza'
import express  from 'express'
const router = express.Router()

router.get('/piazze', getPizza) 

export default router