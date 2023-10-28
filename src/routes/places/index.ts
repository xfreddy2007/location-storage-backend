import express, { Router } from 'express';
import placesController from '../../controllers/places-controller';

const router: Router = express.Router();

const { getPlacesById, getPlacesByUserId, createPlace } = placesController;

// Get place by place id
router.get('/:pid', getPlacesById);
// Get all the stored places that a user has
router.get('/user/:uid', getPlacesByUserId);
// create a stored place data
router.post('/', createPlace);

export default router;
