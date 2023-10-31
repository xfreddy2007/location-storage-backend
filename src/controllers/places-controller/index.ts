import type { PlaceType } from '@/types/places';
import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import crypto, { UUID } from 'crypto';
import { getCoordinatesFromGoogle } from '../../utils/location';

let DUMMY_PLACES: PlaceType[] = [
  {
    id: 'p1-qwe-asd-sdf-ghf',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      latitude: 40.7484474,
      longitude: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1-askdfn-askdfnm-zxk-asmdn',
  },
];

type PlacesControllerKeys =
  | 'getPlaceById'
  | 'getPlacesByUserId'
  | 'createPlace'
  | 'updatePlaceById'
  | 'deletePlaceById';
type PlaceControllerType = Record<PlacesControllerKeys, RequestHandler>;

const placesController: PlaceControllerType = {
  getPlaceById(req, res, next) {
    const placeId = req.params.pid as UUID;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (!place) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    return res.json({ place });
  },
  getPlacesByUserId(req, res, next) {
    const userId = req.params.uid as UUID;
    const place = DUMMY_PLACES.filter((p) => p.id === userId);

    if (!place || place.length === 0) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    return res.json({ place });
  },
  async createPlace(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { title, description, address, creator }: PlaceType = req.body;
    let location: PlaceType['location'];
    try {
      location = await getCoordinatesFromGoogle(address);
    } catch (error) {
      return next(error);
    }

    const createPlace: PlaceType = {
      id: crypto.randomUUID(),
      title,
      description,
      location,
      address,
      creator,
    };

    // add places
    DUMMY_PLACES.push(createPlace);

    return res.status(201).json({ place: createPlace });
  },
  updatePlaceById(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { title, description }: PlaceType = req.body;
    const placeId = req.params.pid as UUID;
    const originalPlaceIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (originalPlaceIndex < 0) {
      return next(new HttpError('Update failed!', 404));
    }

    const updatedPlace = {
      ...DUMMY_PLACES[originalPlaceIndex],
      title,
      description,
    };
    DUMMY_PLACES[originalPlaceIndex] = updatedPlace;

    return res.status(200).json({ place: updatedPlace });
  },
  deletePlaceById(req, res, next) {
    const placeId = req.params.pid as UUID;
    const deletePlaceIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (deletePlaceIndex < 0) {
      return next(new HttpError('Could not find a place for that id.', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
    return res.status(200).json({ message: 'Delete place.' });
  },
};

export default placesController;
