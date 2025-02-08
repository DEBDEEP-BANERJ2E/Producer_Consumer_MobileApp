import pool from '../config/db.js';

export const getToken = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT token FROM tokens LIMIT 1');
    res.json({ token: rows.length > 0 ? rows[0].token : 'No token found' });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
