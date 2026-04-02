const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToDatabase } = require('./lib/mongo');
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();

// Core middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: CLIENT_ORIGIN,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
	})
);

// Health check
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// Global error handler
app.use((err, _req, res, _next) => {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	res.status(status).json({ error: message });
});

async function start() {
	await connectToDatabase();
	app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

start().catch((err) => {
	console.error('Failed to start server', err);
	process.exit(1);
});
