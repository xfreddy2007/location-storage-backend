import type { PlaceType } from '@/types/places';
import { HttpError } from '../models/http-error';
import 'dotenv/config';

import axios from 'axios';

const API_KEY = process.env.GOOGLE_MAP_API_KEY;

export const getCoordinatesFromGoogle = async (address: string): Promise<PlaceType['location']> => {
  const result = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`,
  );
  if (!result) {
    throw new HttpError('Could not find location for the specified address.', 422);
  }
  const { lat, lng } = result.data.results[0].geometry.location;
  return {
    latitude: lat,
    longitude: lng,
  };
};
