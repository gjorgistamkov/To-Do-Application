const express = require('express');
const Todo = require('../models/Todo');
const { requireAuth } = require('../middleware/auth');
const { todoCreateSchema, todoUpdateSchema } = require('../validators/authSchemas');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
	const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
	res.json({ todos });
});

router.post('/', async (req, res) => {
	try {
		const { title } = todoCreateSchema.parse(req.body);
		const todo = await Todo.create({ user: req.userId, title });
		res.status(201).json({ todo });
	} catch (err) {
		res.status(400).json({ error: err.message || 'Invalid data' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const data = todoUpdateSchema.parse(req.body);
		const todo = await Todo.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId },
			{ $set: data },
			{ new: true }
		);
		if (!todo) return res.status(404).json({ error: 'Todo not found' });
		res.json({ todo });
	} catch (err) {
		res.status(400).json({ error: err.message || 'Invalid data' });
	}
});

router.delete('/:id', async (req, res) => {
	const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
	if (!deleted) return res.status(404).json({ error: 'Todo not found' });
	res.json({ ok: true });
});

module.exports = router;
