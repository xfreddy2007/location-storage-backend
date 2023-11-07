import type { PlaceType } from '@/types/places';
import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import crypto, { UUID } from 'crypto';
import { getCoordinatesFromGoogle } from '../../utils/location';
import Place from '../../models/place';

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
  async getPlaceById(req, res, next) {
    const placeId = req.params.pid as UUID;

    let place;
    try {
      place = await Place.findById(placeId);
    } catch (err) {
      return next(new HttpError('Something went wrong, could not find a place.', 500));
    }

    if (!place) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    return res.json({ place: place.toObject({ getters: true }) });
  },
  async getPlacesByUserId(req, res, next) {
    const userId = req.params.uid as UUID;
    let place;
    try {
      place = await Place.find({ creator: userId });
    } catch (err) {
      return next(new HttpError('Fetching places failed, please try again later.', 500));
    }

    if (!place || place.length === 0) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    return res.json({ places: place.map((p) => p.toObject({ getters: true })) });
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

    const createPlace = new Place({
      title,
      description,
      address,
      location,
      image: 'aaa',
      creator,
    });

    // add places
    try {
      await createPlace.save();
    } catch (err) {
      return next(new HttpError('Creating place failed, please try again.', 500));
    }

    return res.status(201).json({ place: createPlace });
  },
  async updatePlaceById(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { title, description }: PlaceType = req.body;
    const placeId = req.params.pid as UUID;

    let place;
    try {
      place = await Place.findById(placeId);
    } catch (err) {
      return next(new HttpError('Something went wrong, could not update place.', 500));
    }

    if (!place) {
      return next(new HttpError('Update failed', 404));
    }

    place.title = title;
    place.description = description;

    try {
      await place.save();
    } catch (err) {
      return next(new HttpError('Something went wrong, could not update place.', 500));
    }
    return res.status(200).json({ place: place.toObject({ getters: true }) });
  },
  async deletePlaceById(req, res, next) {
    const placeId = req.params.pid as UUID;

    let place;
    try {
      place = await Place.findById(placeId);
    } catch (err) {
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    if (!place) {
      return next(new HttpError('Could not find a place for that id.', 404));
    }

    try {
      await place.deleteOne();
    } catch (err) {
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    return res.status(200).json({ message: 'Delete place.' });
  },
};

export default placesController;
