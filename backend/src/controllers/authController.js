import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import pool from '../db.js';

const upload = multer({ dest: 'uploads/' });

export const checkFraud = [
  upload.single('csvFile'),
  async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, 'my-secure-jwt-secret-12345');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { accountDetails, bankName } = req.body;
    const records = [];

    createReadStream(req.file.path)
      .pipe(parse({ delimiter: ',', columns: true, trim: true }))
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', async () => {
        console.log('CSV parsed:', records);

        const features = Array(30).fill(0);
        if (records.length > 0) {
          const row = records[0];
          const rowValues = Object.values(row).map((val) => {
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
          });
          for (let i = 0; i < Math.min(rowValues.length, 30); i++) {
            features[i] = rowValues[i];
          }
        }

        let fraudScore = 0;
        const maxFeature = Math.max(...features);
        if (maxFeature > 1000) {
          fraudScore += 0.5 * (maxFeature / 2000);
        }
        const avgFeature = features.reduce((sum, val) => sum + val, 0) / features.length;
        const highFeatures = features.filter((val) => val > avgFeature * 1.5).length;
        fraudScore += 0.3 * (highFeatures / features.length);
        const previousFeatures = Array(30).fill(0);
        const featureChanges = features.map((val, i) => Math.abs(val - previousFeatures[i]));
        const maxChange = Math.max(...featureChanges);
        if (maxChange > 500) {
          fraudScore += 0.2 * (maxChange / 1000);
        }
        fraudScore = Math.min(fraudScore, 1);

        const result = {
          result: fraudScore > 0.5 ? 'Potential fraud detected' : 'Fraud check complete',
          fraudScore: fraudScore.toFixed(2),
          features,
          file: req.file.filename,
          accountDetails,
          bankName,
        };

        try {
          await pool.query(
            `INSERT INTO transactions (user_id, result, fraud_score, features, account_details, bank_name, file_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              decoded.id,
              result.result,
              result.fraudScore,
              JSON.stringify(result.features),
              result.accountDetails,
              result.bankName,
              result.file,
            ]
          );
        } catch (err) {
          console.error('Error saving transaction to database:', err);
        }

        res.json(result);
      })
      .on('error', (err) => {
        res.status(500).json({ error: 'Error parsing CSV: ' + err.message });
      });
  },
];