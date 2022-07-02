import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import express, { Express, Request, Response } from 'express'
import './passport'

import authRout from './routes/auth'
import { auth, User } from './middleware/auth'

const app: Express = express()
dotenv.config()


const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza'
const PORT = process.env.PORT || 5000;

app.use(expressSession({ secret: 'secret' }))
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))




app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://pizza-app-react.herokuapp.com' : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}))


app.use('/api/auth', authRout)



const isLogin = (req: Request, res: Response, next: Function) => {
    if (req.user) return next()
    return res.status(401).json({ message: "you must login" })
}

// test
app.get('/', auth, (req: any, res: Response) => {
    res.json({ cookie: req.cookies, user: req.user })
})

app.get('/google', (req: Request, res: Response) => {
    res.send(`<a href="/auth/google">Login with google</a>`)
})

app.get('/auth/google', async (req: Request, res: Response) => {
    await passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res)
})

app.get('/api/auth/google/callback', (req: Request, res: Response) => {
    passport.authenticate('google', {
        successRedirect: '/hello',
        failureRedirect: '/failure'
    })(req, res)
})

app.get('/failure', (req: Request, res: Response) => {
    res.send('failure')
})

app.get('/hello', isLogin, (req: Request, res: Response) => {
    res.send('hello')
})

mongoose.connect(DB_URL).then(() => {
    app.listen(PORT, () => console.log(`app listening in http://localhost:${PORT} and database connected !`))
}).catch(err => console.log(err))