import type { PlaceType } from '@/types/places';

const API_KEY = process.env.GOOGLE_MAP_API_KEY;

const getCoordinatesFromGoogle = async (addres: string): Promise<PlaceType['location']> => {
  return {
    latitude: 0,
    longitude: 0,
  };
};
