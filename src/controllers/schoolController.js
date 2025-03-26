import { validationResult } from 'express-validator';
import School from '../models/schoolModel.js';

const schoolController = {
  addSchool: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const schoolId = await School.createSchool(req.body);
      res.status(201).json({ 
        message: 'School added successfully', 
        schoolId 
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  listSchools: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const schools = await School.getSchoolsSortedByDistance(
        req.query.latitude,
        req.query.longitude
      );
      res.json(schools);
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Added getAllSchools directly in the main controller
  getAllSchools: async (req, res) => {
    try {
      const schools = await School.getAllSchools();
      res.json(schools);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Single export statement
export default schoolController;