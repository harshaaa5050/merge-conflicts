import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateJWT } from '../middlewares/authMiddleware.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, googleId } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            googleId,
        })

        const savedUser = await newUser.save()
        const token = generateJWT ({ id: savedUser._id, email: savedUser.email })
        res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
		})
        res.status(201).json({ message: 'User registered successfully', user: savedUser })
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message })
    }
}