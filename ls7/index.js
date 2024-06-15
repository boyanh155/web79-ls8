import express from 'express';
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import UserModel from './models/users.model.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


dotenv.config()

const app = express();

app.use(express.json({
    limit: '50mb'
}))
app.use(cors())

//
// try{
// await mongoose.connect()
// }catch(err){
// }
mongoose.connect(process.env.DB_CONNECTION_STRING).then(
    () => {
        console.log("DB connected")



        // token:
        // accessToken 

        // 2 types of route

        // - private routes: /my-profile ; /my-wallet ; /my-class 
        // ---> authenticated required

        // - public routes: /login /register ->
        // ---> Authenticate user: accessToken

        // 1 user want to use private routes 
        // /register -> /login [accessToken]

        // headers:{Authorization:`Bearer ${accessToken}`}
        // /my-profile -> middleware(authentication) -> accessToken verify -> userID


        // routes
        //
        // @@POST /login
        // Login

        app.get('/login', (req, res) => res.send("Hello mom"))
        app.post("/login", async(req, res, next) => {
                try {
                    // username, password
                    const { username, password } = req.body

                    if (!username || !password) return res.status(400).json({
                        message: "Missing inputs"
                    })

                    const user = await UserModel.findOne({
                            username: username,
                        })
                        // username
                    if (!user) return res.status(404).json({
                        message: "User not found"
                    })

                    console.log(user.hashPassword)
                    console.log(password)
                    const isValidPassword = await bcrypt.compare(password, user.hashPassword)
                        // password
                    if (!isValidPassword) return res.status(401).json({
                        message: "Password invalid"
                    })

                    // accessToken
                    const accessToken = jwt.sign({
                        _id: user._id
                    }, process.env.JWT_SECRET)

                    return res.status(200).json({
                        accessToken
                    })


                } catch (err) {
                    console.log(err)
                    return res.json({ err: JSON.stringify(err) })
                }

            })
            // @@POST /register
            // Register
        app.post('/register', async(req, res, next) => {
            try {
                const { username, password } = req.body
                if (!username || !password) return res.status(400).json({
                    message: "Missing inputs",
                    error: 1
                })
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await UserModel.create({
                    username,
                    hashPassword: hashedPassword
                })
                return res.status(200).json(newUser)
            } catch (err) {
                console.log(err)
                return res.json(err)
            }
        })

        // @@GET /my-profile

        app.get("/my-profile", async(req, res) => {
            try {

                // Bearer token
                // ['Bearer', token]
                const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

                const payload = jwt.verify(token, process.env.JWT_SECRET)
                const user = await UserModel.findById(payload._id, {
                    hashPassword: 0
                })

                return res.status(200).json({
                    user
                })

            } catch (err) {
                return res.json(err)
            }
        })


        app.listen(process.env.PORT, () => {
            console.log(`App is running on PORT ${process.env.PORT}`)
        })
    }
).catch(err => {
    console.log(err)
    process.exit(1)
})