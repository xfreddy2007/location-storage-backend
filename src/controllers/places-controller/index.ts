import { PlaceType } from '@/types/places';
import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import crypto, { UUID } from 'crypto';

const DUMMY_PLACES: PlaceType[] = [
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

type PlacesControllerKeys = 'getPlacesById' | 'getPlacesByUserId' | 'createPlace';
type PlaceControllerType = Record<PlacesControllerKeys, RequestHandler>;

const placesController: PlaceControllerType = {
  getPlacesById: (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (!place) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    res.json({ place });
  },
  getPlacesByUserId: (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find((p) => p.id === userId);

    if (!place) {
      return next(new HttpError('Cannot find a place with provided id.', 404));
    }

    res.json({ place });
  },
  createPlace: (req, res, next) => {
    const { title, description, location, address, creator }: PlaceType = req.body;
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

    res.status(201).json({ place: createPlace });
  },
};

export default placesController;
