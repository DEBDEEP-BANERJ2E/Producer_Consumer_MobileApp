/* Backend/routes/consumerRoutes.ts */
import express from 'express';
import pool from '../models/tokenModel';

const router = express.Router();

router.get('/getTokens', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tokens'); // Get all tokens
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tokens');
  }
});


export default router;
