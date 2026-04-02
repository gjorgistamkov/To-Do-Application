const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
	const token = req.cookies?.[process.env.COOKIE_NAME || 'auth_token'];
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		req.userId = payload.sub;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}

module.exports = { requireAuth };
