import { Schema, model, Types, Document } from 'mongoose';

export interface PlaceType extends Document {
  title: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  creator: Types.ObjectId;
}

const placeSchema = new Schema<PlaceType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export default model<PlaceType>('Place', placeSchema);
