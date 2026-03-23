import express from 'express'
import app from './src/app.js'
import env from './src/config/env.js'
import connectDB from './src/config/db.js'

const server = express()

server.use('/api', app)

const startServer = async () => {
	try {
		await connectDB()
		server.listen(env.PORT, () => {
			console.log(`Server is running on port ${env.PORT}`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

startServer()

server.get('/', (req, res) => {
	res.send('Welcome to the Hackathon Project')
})
