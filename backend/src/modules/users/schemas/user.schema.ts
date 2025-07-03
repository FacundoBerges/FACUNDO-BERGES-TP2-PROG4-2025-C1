import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Profile } from '../interfaces/profile.type';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 50, minlength: 2 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 50, minlength: 2 })
  surname: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
    minlength: 5,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_.-]+$/,
  })
  username: string;

  @Prop({ required: true, trim: true })
  hashedPassword: string;

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

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ default: null, maxlength: 1024 })
  profilePictureUrl?: string;

  @Prop({ default: null, maxlength: 500 })
  bio?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
