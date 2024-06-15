import { model, Schema } from "mongoose";


const UserSchema = Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    hashPassword: {
        type: String,
        require: true,
    }
}, {
    timestamps: true
})

// model
const UserModel = model('users', UserSchema)


export default UserModel