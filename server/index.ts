import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieSession from 'cookie-session'
import express, { Express, Request, Response } from 'express'
import passportConfig from './passport'

import authRout from './routes/auth'

const app: Express = express()
dotenv.config()

const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza'
const PORT = process.env.PORT || 5000;


app.use(cookieSession({
    name: 'session',
    keys: ['key'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://pizza-app-react.herokuapp.com' : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))


app.use('/api/auth', authRout)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
})


mongoose.connect(DB_URL).then(() => {
    app.listen(PORT, () => console.log(`app listening in http://localhost:${PORT} and database connected !`))
}).catch(err => console.log(err))