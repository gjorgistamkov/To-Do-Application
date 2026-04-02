const { z } = require('zod');

const email = z
	.string()
	.trim()
	.toLowerCase()
	.regex(/^(?:[a-zA-Z0-9_'^&\/+\-])+(?:\.(?:[a-zA-Z0-9_'^&\/+\-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/);

const password = z.string().min(6);

const registerSchema = z.object({ email, password });
const loginSchema = z.object({ email, password });

const todoCreateSchema = z.object({ title: z.string().trim().min(1) });
const todoUpdateSchema = z.object({ title: z.string().trim().min(1).optional(), completed: z.boolean().optional() });

module.exports = { registerSchema, loginSchema, todoCreateSchema, todoUpdateSchema };
