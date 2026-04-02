const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validators/authSchemas');

const router = express.Router();

function setAuthCookie(res, userId) {
	const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
	const cookieName = process.env.COOKIE_NAME || 'auth_token';
	res.cookie(cookieName, token, {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
}

router.post('/register', async (req, res) => {
	try {
		const { email, password } = registerSchema.parse(req.body);
		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ error: 'Email already registered' });
		const user = new User({ email });
		await user.setPassword(password);
		await user.save();
		setAuthCookie(res, user._id.toString());
		return res.status(201).json({ user: { id: user._id, email: user.email } });
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Invalid data' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = loginSchema.parse(req.body);
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		setAuthCookie(res, user._id.toString());
		return res.json({ user: { id: user._id, email: user.email } });
	} catch (err) {
		return res.status(400).json({ error: err.message || 'Invalid data' });
	}
});

router.get('/me', async (req, res) => {
	const cookieName = process.env.COOKIE_NAME || 'auth_token';
	const token = req.cookies?.[cookieName];
	if (!token) return res.json({ user: null });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		const user = await User.findById(payload.sub).lean();
		if (!user) return res.json({ user: null });
		return res.json({ user: { id: user._id, email: user.email } });
	} catch (_e) {
		return res.json({ user: null });
	}
});

router.post('/logout', (req, res) => {
	const cookieName = process.env.COOKIE_NAME || 'auth_token';
	res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax' });
	res.json({ ok: true });
});

module.exports = router;
