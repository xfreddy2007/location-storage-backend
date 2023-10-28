import type { UUID } from 'crypto';

export type PlaceType = {
  id: UUID;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  creator: UUID;
};
