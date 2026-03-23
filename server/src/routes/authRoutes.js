import express from 'express'
import { registerUser } from '../services/authServices.js'

const authRouter = express.Router()

authRouter.post('/register', registerUser)

export default authRouter