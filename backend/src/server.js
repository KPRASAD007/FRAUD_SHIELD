import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import { initDB } from './db.js';
import pool from './db.js';
import { sendFraudAlertEmail } from './email.js';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('checkFraud', async (data) => {
    const isFraud = data.features.some((feature) => feature > 1000);
    if (isFraud) {
      const alert = {
        message: 'Potential fraud detected!',
        accountDetails: data.accountDetails,
      };
      io.emit('fraudAlert', alert);

      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
        const result = await pool.query('SELECT email FROM users WHERE id = $1', [decoded.id]);
        const userEmail = result.rows[0]?.email;
        if (userEmail) {
          await sendFraudAlertEmail(userEmail, data.accountDetails);
        }
      } catch (err) {
        console.error('Error sending fraud alert email:', err);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5001;
httpServer.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initDB();
});