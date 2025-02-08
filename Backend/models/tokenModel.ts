/* Backend/models/tokenModel.ts */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export const connectDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        displayed BOOLEAN DEFAULT false
      )
    `);
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default pool;