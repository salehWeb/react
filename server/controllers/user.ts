import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

interface UserType {
    name: string,
    email: string,
    password?: string,
    method?: Boolean
}

export const login = async (req: Request, res: Response) => {
    const { email, password, method } = req.body as UserType;
    const user = await prisma.user.findUnique({ where: { email: email } });
    try {

        if (!user) return res.status(400).json({ error: `user with this email ${email} dose not exist` })

        else {
            if (password && email) {
                const isMatch = compareSync(password, user.password)
                if (!isMatch) return res.status(400).json({ error: `password is incorrect` })
                else {
                    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '2h' });

                    res.cookie('token', token, {
                        maxAge: 1000 * 60 * 60 * 2, // 2 hours
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    })

                    return res.status(200).json({ user, massage: "login success" })
                }
            } else if (method && email && user.method === "PROVIDER") {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '2h' });

                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 60 * 2, // 2 hours
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                })

                return res.status(200).json({ user, massage: "login success" })

            }

            else return res.status(400).json({ error: 'you must fill all fields or sing up with google or github' })
        }
    } catch (error) {
        console.log(error)
    }


}


export const singUp = async (req: Request, res: Response) => {
    const { email, name, password, method } = req.body as UserType;
    const user = await prisma.user.findUnique({ where: { email: email } })
    try {

        if (!user) {
            if (password && name && email && !method) {
                const salt = genSaltSync(10);
                const hashPassword = hashSync(password, salt)
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashPassword
                    }
                })

                const token = jwt.sign({ id: newUser.id, }, process.env.JWT_SECRET as string, { expiresIn: '2h' })

                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 60 * 2, // 2 hours
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                })

                return res.status(200).json({ newUser, massage: "sing up success" })
            }
            else if (name && email && method) {

                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        method: 'PROVIDER',
                    }
                })

                const token = jwt.sign({ id: newUser.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '2h' })

                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 60 * 2, // 2 hours
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                })

                return res.status(200).json({ newUser, massage: "sing up success" })
            }

            else return res.status(400).json({ error: 'you must fill all fields or sing up with google or github' })

        }
        else return res.status(400).json({ error: "user already exist try login" })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(200).json({ massage: "logout success model" })
}


export const googleAuth = async (req: Request, res: Response) => {
    const { id_token } = req.body;
    const googleUser = await prisma.user.findUnique({ where: { googleId: id_token } });
    try {
        if (!googleUser) {
            const newUser = await prisma.user.create({
                data: {
                    googleId: id_token,
                    method: 'PROVIDER'
                }
            })

            const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET as string, { expiresIn: '2h' })

            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 2, // 2 hours
                expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })

            return res.status(200).json({ newUser, massage: "sing up success" })
        }
        else {
            const token = jwt.sign({ id: googleUser.id, role: googleUser.role }, process.env.JWT_SECRET as string, { expiresIn: '2h' })

            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 2, // 2 hours
                expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })

            return res.status(200).json({ googleUser, massage: "sing up success" })
        }
    } catch (error) {
        console.log(error)
    }
}