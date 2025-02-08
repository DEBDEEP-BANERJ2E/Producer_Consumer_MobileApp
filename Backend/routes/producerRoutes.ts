/* Backend/routes/producerRoutes.ts */
import express from 'express';
import pool from '../models/tokenModel';

const router = express.Router();

router.post('/storeToken', async (req, res) => {
  const { timestamp, latitude, longitude } = req.body;
  try {
    await pool.query(
      'INSERT INTO tokens (timestamp, latitude, longitude) VALUES (?, ?, ?)',
      [timestamp, latitude, longitude]
    );
    res.status(201).send('Token stored');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error storing token');
  }
});

export default router;