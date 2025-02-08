/* Backend/routes/consumerRoutes.ts */
import express from 'express';
import pool from '../models/tokenModel';

const router = express.Router();

router.get('/getTokens', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tokens WHERE displayed = false');
    await pool.query('UPDATE tokens SET displayed = true WHERE displayed = false');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tokens');
  }
});

export default router;
