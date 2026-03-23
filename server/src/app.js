import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js'


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true, // Allow cookies to be sent
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
)

app.use('/auth', authRouter)

export default app
