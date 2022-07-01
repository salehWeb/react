import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import express, { Express, Request, Response } from 'express'

import authRout from './routes/auth'
import { auth } from './middleware/auth'

const app: Express = express()
dotenv.config()


const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza'
const PORT = process.env.PORT || 5000;




app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())


app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://pizza-app-react.herokuapp.com' : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))


app.use('/api/auth', authRout)


interface RequestUserAuth extends Request {
    user?: {
        id: string
        role: string
        iat: number
        exp: number
    }
}


// test
app.get('/', auth, (req: RequestUserAuth, res: Response) => {
    res.json({ cookie: req.cookies, user: req.user })
})


mongoose.connect(DB_URL).then(() => {
    app.listen(PORT, () => console.log(`app listening in http://localhost:${PORT} and database connected !`))
}).catch(err => console.log(err))