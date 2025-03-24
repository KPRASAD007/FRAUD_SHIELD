import jwt from 'jsonwebtoken';
import 'dotenv/config';
import process from 'process';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader);
  const token = authHeader?.replace('Bearer ', '');
  console.log('Extracted Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Verification Error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;