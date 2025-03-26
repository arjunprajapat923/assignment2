import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


const sslCertificate = process.env.AIVEN_CA_CERT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
     rejectUnauthorized: false
  },
  connectTimeout: 30000 
});

async function verifyDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🟢 Successful database connection');
    await connection.ping();
    console.log('🟢 Database ping successful');
  } catch (error) {
    console.error('🔴 Connection failed:', error);
    throw error; // Rethrow to prevent server start
  } finally {
    if (connection) connection.release();
  }
}

verifyDatabaseConnection()
  .then(() => console.log('✅ Database initialization complete'))
  .catch(err => {
    console.error('❌ Fatal database error');
    process.exit(1);
  });

export default pool;