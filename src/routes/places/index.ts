import { Router } from 'express';
import { check } from 'express-validator';
import placesController from '../../controllers/places-controller';

const router: Router = Router();

const { getPlaceById, getPlacesByUserId, createPlace, updatePlaceById, deletePlaceById } = placesController;

// Get place by place id
router.get('/:pid', getPlaceById);

// Get all the stored places that a user has
router.get('/user/:uid', getPlacesByUserId);

// create a stored place data
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace,
);

// update a stored place data
router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  updatePlaceById,
);

// delete a stored place data
router.delete('/:pid', deletePlaceById);

export default router;
