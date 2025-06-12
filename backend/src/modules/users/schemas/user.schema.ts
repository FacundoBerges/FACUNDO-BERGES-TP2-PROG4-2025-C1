import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Profile } from '../interfaces/profile.type';

export type UserDocument = HydratedDocument<User>;

@Schema({})
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 50, minlength: 2 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 50, minlength: 2 })
  surname: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
    minlength: 5,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    match: /^[a-zA-Z0-9_.-]+$/,
  })
  username: string;

  @Prop({ required: true, trim: true })
  hashedPassword: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    default: 'user',
    type: String,
  })
  profile: Profile;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ default: null })
  profilePictureUrl?: string;

  @Prop({ default: null, maxlength: 500, minlength: 0 })
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
