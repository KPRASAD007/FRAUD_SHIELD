const { PythonShell } = require('python-shell');
const pool = require('../config/db');

exports.getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT username, email, role FROM users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkFraud = async (req, res) => {
  const { features } = req.body; // Expects 30 features (Time, V1-V28, Amount)
  if (!features || features.length !== 30) {
    return res.status(400).json({ error: 'Invalid features array, must be 30 elements' });
  }

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './src/scripts',
    args: [JSON.stringify({ features })],
  };

  PythonShell.run('predict_fraud.py', options, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const result = JSON.parse(results[0]);
    res.json(result); // { prediction: 0/1, probability: float }
  });
};