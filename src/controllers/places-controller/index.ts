import type { PlaceType } from '@/types/places';
import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { getCoordinatesFromGoogle } from '../../utils/location';
import Place from '../../models/place';
import User from '../../models/user';
import { startSession } from 'mongoose';

type PlacesControllerKeys =
  | 'getPlaceById'
  | 'getPlacesByUserId'
  | 'createPlace'
  | 'updatePlaceById'
  | 'deletePlaceById';
type PlaceControllerType = Record<PlacesControllerKeys, RequestHandler>;

const placesController: PlaceControllerType = {
  async getPlaceById(req, res, next) {
    const placeId = req.params.pid;

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
    const userId = req.params.uid;
    let place;

    let userWithPlaces;
    try {
      userWithPlaces = await User.findById(userId).populate('places');
    } catch (err) {
      return next(new HttpError('Fetching places failed, please try again later.', 500));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    return res.json({ places: userWithPlaces.places.map((p) => p.toObject({ getters: true })) });
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

    const createdPlace = new Place({
      title,
      description,
      address,
      location,
      image: 'aaa',
      creator,
    });

    let user;
    try {
      user = await User.findById(creator);
    } catch (err) {
      return next(new HttpError('Creating place failed, please try again.', 500));
    }

    if (!user) {
      return next(new HttpError('Could not find user for provided id', 404));
    }

    // add places
    try {
      const session = await startSession();
      session.startTransaction();

      await createdPlace.save({ session });
      user.places.push(createdPlace);
      await user.save({ session });

      await session.commitTransaction();
    } catch (err) {
      return next(new HttpError('Creating place failed, please try again.', 500));
    }

    return res.status(201).json({ place: createdPlace });
  },
  async updatePlaceById(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { title, description }: PlaceType = req.body;
    const placeId = req.params.pid;

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
    const placeId = req.params.pid;

    let place;
    try {
      place = await Place.findById(placeId).populate('creator');
    } catch (err) {
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    if (!place) {
      return next(new HttpError('Could not find a place for that id.', 404));
    }

    try {
      const session = await startSession();
      session.startTransaction();

      await place.remove({ session });
      const creator = await User.findById(place.creator);
      creator?.places.pull(place);
      await creator?.save({ session });

      await session.commitTransaction();
    } catch (err) {
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    }

    return res.status(200).json({ message: 'Delete place.' });
  },
};

export default placesController;
