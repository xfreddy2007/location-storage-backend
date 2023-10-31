import express, { Router } from 'express';
import placesController from '../../controllers/places-controller';

const router: Router = express.Router();

const { getPlaceById, getPlacesByUserId, createPlace, updatePlaceById, deletePlaceById } = placesController;

// Get place by place id
router.get('/:pid', getPlaceById);

// Get all the stored places that a user has
router.get('/user/:uid', getPlacesByUserId);

// create a stored place data
router.post('/', createPlace);

// update a stored place data
router.patch('/:pid', updatePlaceById);

// delete a stored place data
router.delete('/:pid', deletePlaceById);

export default router;
