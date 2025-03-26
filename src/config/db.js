import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// SSL certificate should have exact formatting
const sslCertificate = `
-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUDbNUYanHADGlM1rNZVmQZl0sbMMwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1Njk5OGZlZDUtYjk4Yi00YjFiLTlhMDQtOGUzN2U0Y2Nl
ZjlmIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMzI2MjAyNDI4WhcNMzUwMzI0MjAy
NDI4WjBAMT4wPAYDVQQDDDU2OTk4ZmVkNS1iOThiLTRiMWItOWEwNC04ZTM3ZTRj
Y2VmOWYgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAJ5/LFEp22Jolr5kKCfy1lJJSuDIcYWsw7nrdzjTIJ6aHYQf/LKOxF9D
GcbVTghGzcMGiB3H5k3BUBHa/rK0ebxhScaD67YbSgZ6QbkgnrWW2/+ECjOPhgyu
gf3a+leiy2nM69I0yxIdr/fth8kn3sAsmlfnKjbadIkeZaospNqlKxnPFbg/SY2D
3pvxli1o7RZEQZ/zd7TNcImhkdVnUF3SILyTIQ4EQnEq5jhtAGIR7pFgXm9GAx3C
OijxLP+bP++fJD2Hf6zPRAe3jYEyLyruqjFdnB8X0a5XQWLVpBT9L4y/PQ7I1HIc
TZh2N04qv/CVOgetel49//zv4UTiLumCbfl7v7WUpPWPPayImmxye6ZCHxMT0YOe
hK0RoQ6ezq8vw4kGk8UaQInUBeMVvFc+RQtwl9wD9E7+GdFB76+C9XZnWrk3XlUn
4BHBdGt+j+yNwN8qElFxPV62jPIFzZchiYDu8Rxw5zWN7lKG8++AzPF+oOovuacB
d55Ie8l6pQIDAQABoz8wPTAdBgNVHQ4EFgQUCUHlneEtATeQuDDT0pOE/CVAo80w
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AHD1wA3tSRpLFWwyUYdNW21wocUdJJEKnPvhU//BkYkIeiTwyB+Hm6hGH5RMQINM
7IZnRt/EYtvUwrSlNClPJTg96f4XfNY4HN/e6cf27bnlUXM0R9Ye3wsPlhMqeoFI
2vPvkaWbfx2XehSYAH6jogVyCRJJu9xxR1PiEQVO9hXBALYLIMdfXAw9fAxxndVI
lTgdjw0NF2JtN6ZYv+q1Vc+/diowkqqqKgPBNJCKNzV+MIm6C+qpNEFmgBfw8L+T
S1oossffBiyROF8tuCJYo6jlDJg933dg3XmzA92MXsopWCy+QTPE60j25mukywid
hkSCIDhN3gWxEQQSt8DrL/UBaM5boaZXyrxUR4fgsNXjHGu6VOiK2v4K7yNhHyRv
WYoyClvR3RPoZAUEwEyTFoBw1FsDQBTNWDvIRxQ+aLZ6/ERiiYYDJ3Ejv9cuMEbl
fX0tF5U5V2z7hvHClmru+T1h3MPJ1ilRbVzmg9IkTjX+fWGNH55gZTjqoR7utNv/
Cg==
-----END CERTIFICATE-----
`;

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
    ca: sslCertificate,
    rejectUnauthorized: true
  },
  connectTimeout: 30000 // Increased to 30 seconds
});

// Enhanced connection test
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

// Verify connection before starting server
verifyDatabaseConnection()
  .then(() => console.log('✅ Database initialization complete'))
  .catch(err => {
    console.error('❌ Fatal database error');
    process.exit(1);
  });

export default pool;