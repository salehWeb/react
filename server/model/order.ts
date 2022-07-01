import mongoose from 'mongoose'

const orderShame = new mongoose.Schema({

    name: { type: String, require },
    email: { type: String, require },
    id: { type: String, require },
    orderItems: [],
    shippingAdders: { type: Object },
    orderAmount: { type: Number, require },
    orderStates: { type: Boolean, require },
    transAciton: { type: String, require },
},
    {
        timestamps: true
    }
)


const Order = mongoose.model('orders', orderShame)

export default Order;