import express from 'express';
// import User from '../models/User.js';  // Commenté temporairement
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: { code: 401, message: 'Invalid credentials' } });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: { code: 401, message: 'Invalid credentials' } });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30m' });
  res.json({ token, user: { id: user._id, email: user.email, role: user.role, displayName: user.displayName } });
});

export default router;
