import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Profile } from '../interfaces/profile.type';

export type UserDocument = HydratedDocument<User>;

@Schema({})
export class User {
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
    unique: true,
    maxlength: 50,
    minlength: 3,
  })
  username: string;

  @Prop({ required: true, trim: true, minlength: 8 })
  hashedPassword: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: 'user', type: String })
  profile: Profile;

  @Prop({ default: null })
  profilePictureUrl?: string;

  @Prop({ default: null, maxlength: 500, minlength: 0 })
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
