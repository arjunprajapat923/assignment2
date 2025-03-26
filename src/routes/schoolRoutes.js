import { body, query } from 'express-validator';
import express from 'express';
import schoolController from '../controllers/schoolController.js';

const router = express.Router();


router.post('/addSchool',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ],
  schoolController.addSchool
);

router.get('/listSchools',
  [
    query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ],
  schoolController.listSchools
);

router.get('/schools', schoolController.getAllSchools);

export default router;