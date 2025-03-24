import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import 'dotenv/config';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fraud Shield API Tester</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          form { margin-bottom: 20px; }
          pre { background: #f0f0f0; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Fraud Shield API Tester</h1>
        
        <h2>Signup</h2>
        <form id="signupForm">
          <input type="text" name="name" placeholder="Name" required><br>
          <input type="email" name="email" placeholder="Email" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Signup</button>
        </form>
        <pre id="signupResponse"></pre>

        <h2>Login</h2>
        <form id="loginForm">
          <input type="email" name="email" placeholder="Email" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Login</button>
        </form>
        <pre id="loginResponse"></pre>

        <h2>Check Fraud</h2>
        <form id="checkFraudForm">
          <input type="text" name="features" placeholder="Features" required><br>
          <input type="text" name="token" placeholder="Paste Token Here" required><br>
          <button type="submit">Check Fraud</button>
        </form>
        <pre id="checkFraudResponse"></pre>

        <script>
          async function handleSubmit(event, endpoint, responseId) {
            event.preventDefault();
            const form = event.target;
            const data = Object.fromEntries(new FormData(form));
            const options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            };
            if (endpoint === '/api/auth/check-fraud') {
              options.headers['Authorization'] = 'Bearer ' + data.token;
              delete data.token;
              options.body = JSON.stringify({ features: data.features });
            }
            try {
              const response = await fetch('http://localhost:5000' + endpoint, options);
              const result = await response.json();
              document.getElementById(responseId).textContent = JSON.stringify(result, null, 2);
            } catch (error) {
              document.getElementById(responseId).textContent = 'Error: ' + error.message;
            }
          }

          document.getElementById('signupForm').addEventListener('submit', (e) => handleSubmit(e, '/api/auth/signup', 'signupResponse'));
          document.getElementById('loginForm').addEventListener('submit', (e) => handleSubmit(e, '/api/auth/login', 'loginResponse'));
          document.getElementById('checkFraudForm').addEventListener('submit', (e) => handleSubmit(e, '/api/auth/check-fraud', 'checkFraudResponse'));
        </script>
      </body>
    </html>
  `);
});

app.use('/api/auth', authRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});