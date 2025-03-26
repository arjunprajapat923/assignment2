import pool from '../config/db.js';

const School = {
  createSchool: async (schoolData) => {
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [schoolData.name, schoolData.address, schoolData.latitude, schoolData.longitude]
    );
    return result.insertId;
  },

  getSchoolsSortedByDistance: async (userLat, userLng) => {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        name, 
        address, 
        latitude, 
        longitude,
        (6371 * ACOS(
          COS(RADIANS(?)) * 
          COS(RADIANS(latitude)) * 
          COS(RADIANS(longitude) - RADIANS(?)) + 
          SIN(RADIANS(?)) * 
          SIN(RADIANS(latitude))
        )) AS distance 
      FROM schools 
      ORDER BY distance`,
      [userLat, userLng, userLat]
    );
    return rows;
  }
};

export default School;