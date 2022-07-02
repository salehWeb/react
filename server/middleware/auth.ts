import jwt from "jsonwebtoken";
import { Response, Request } from "express";

export interface User {
    id: string
    role: string
    iat: number
    exp: number
}


export const auth = async (req: any, res: Response, next: Function) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "you must login" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = decoded;
        req.user = user as User;
        next();
    } catch (error) {
        return res.status(401).json({ message: "you must login" });
    }
}