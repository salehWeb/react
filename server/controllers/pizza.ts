import { Request, Response } from "express"
import Pizza from "../model/pizze"

export const getPizza = async (req: Request, res: Response) => {
    try {

        const pizzas = await Pizza.find({})
        res.status(200).json(pizzas)

    } catch (error) {
        return res.status(400).json({ message: error })
    }
    
}