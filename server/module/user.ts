import mongoose from 'mongoose'


const UserShame = new mongoose.Schema({
    name: { type: String, require },
    password: { type: String, require },
    isAdman: { type: Boolean, require, default: false }
},
    {
        timestamps: true
    }
)


const User = mongoose.model('users', UserShame)

export default User;