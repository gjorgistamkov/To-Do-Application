const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			match: /^(?:[a-zA-Z0-9_'^&\/+\-])+(?:\.(?:[a-zA-Z0-9_'^&\/+\-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/,
		},
		passwordHash: { type: String, required: true },
	},
	{ timestamps: true }
);

UserSchema.methods.setPassword = async function setPassword(password) {
	const salt = await bcrypt.genSalt(10);
	this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = function comparePassword(password) {
	return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
