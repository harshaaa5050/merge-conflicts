// email, password

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
		trim: true,
		lowercase: true,
	},
	password: { type: String, required: true },
	googleId: { type: String },
})

const User = mongoose.model('User', userSchema)

export default User