import { Schema, model, Types, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import type { PlaceType } from './place';

export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  places: Types.DocumentArray<PlaceType>;
}

const userSchema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: 'Place' }],
});

userSchema.plugin(uniqueValidator);

export default model<UserType>('User', userSchema);
