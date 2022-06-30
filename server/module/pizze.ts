import mongoose from 'mongoose'


const pizzaSchema = new mongoose.Schema({
    name: { type: String, require },
    variants: [],
    prises: [],
    category: { type: String, require },
    img: { type: String, require },
    docs: { type: String, require },
},  {
        timestamps: true
    } 
)
const Pizza = mongoose.model('pizzas', pizzaSchema)

export default Pizza;