import { hashSync, genSaltSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface UserType {
    name: string,
    email: string,
    password?: string,
    role?: string,
    token?: string
}

export const login = async (req: Request, res: Response) => {
    const { email } = req.body as UserType;

    try {
        const user = await prisma.user.findFirst({ where: { email } })

        if (!user) return res.status(400).json({ error: `this user not exist ${email}` })

        else return res.status(200).json({ user })
    } catch (error) {
        console.log(error)
    }


}


export const singUp = async (req: Request, res: Response) => {

    const { email, name, password } = req.body as UserType;

    try {
        const user = await prisma.user.findFirst({ where: { email } })


        if (!user) {
            if (password) {
                const salt = genSaltSync(10);
                const hashPassword = hashSync(password, salt)
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashPassword
                    }
                })
                return res.status(200).json({ newUser })
            } else {
                jwt
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        method: 'PROVIDER'
                    }
                })
                return res.status(200).json({ newUser })
            }
        }
        else return res.status(400).json({ error: "user already exist try login" })
    } catch (error) {
        console.log(error)
    }
}