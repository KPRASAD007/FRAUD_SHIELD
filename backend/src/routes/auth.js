import express from 'express';
import bcryptjs from 'bcryptjs'; // Use the default import explicitly
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { checkFraud } from '../controllers/authController.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10); // Use bcryptjs instead of bcrypt
    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcryptjs.compare(password, user.password))) { // Use bcryptjs instead of bcrypt
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'my-secure-jwt-secret-12345',
      { expiresIn: '24h' }
    );
    res.json({ email: user.email, role: user.role, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    const result = await pool.query('SELECT id, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user role (admin only)
router.put('/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  const { role } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get transactions for the authenticated user
router.get('/transactions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [decoded.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get summary statistics for the authenticated user
router.get('/stats', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM transactions WHERE user_id = $1',
      [decoded.id]
    );
    const fraudResult = await pool.query(
      "SELECT COUNT(*) as fraud FROM transactions WHERE user_id = $1 AND result = 'Potential fraud detected'",
      [decoded.id]
    );

    const total = parseInt(totalResult.rows[0].total, 10);
    const fraud = parseInt(fraudResult.rows[0].fraud, 10);
    const fraudRate = total > 0 ? (fraud / total) * 100 : 0;

    res.json({
      totalTransactions: total,
      fraudTransactions: fraud,
      fraudRate: fraudRate.toFixed(2),
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/check-fraud', checkFraud);

export default router;