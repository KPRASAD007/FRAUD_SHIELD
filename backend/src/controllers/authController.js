import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import 'dotenv/config';
import process from 'process';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT email FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err.stack);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.stack);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

export const checkFraud = (req, res) => {
  const { features } = req.body;
  if (!Array.isArray(features) || features.length !== 30) {
    return res.status(400).json({ message: 'Features must be an array of 30 numbers' });
  }
  // Mock prediction (replace with real logic later)
  const prediction = Math.random() > 0.5 ? 1 : 0; // 0 = legit, 1 = fraud
  const probability = Math.random();

  res.json({ prediction, probability });
};

export const getUser = async (req, res) => {
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, name AS username, email, role FROM users WHERE id = $1', [userId]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.stack);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};