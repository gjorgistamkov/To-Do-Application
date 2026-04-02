const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
	if (isConnected) return;
	const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_app';
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri, {
		maxPoolSize: 10,
	});
	isConnected = true;
	console.log('Connected to MongoDB');
}

module.exports = { connectToDatabase };
