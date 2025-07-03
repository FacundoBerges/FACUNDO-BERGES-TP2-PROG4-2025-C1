import { Types } from 'mongoose';

import { Profile } from 'src/modules/users/interfaces/profile.type';

export interface JwtPayload {
  sub: Types.ObjectId;
  name: string;
  surname: string;
  username: string;
  email: string;
  profile: Profile;
  isActive: boolean;
  birthday: Date;
  profilePictureUrl?: string;
  createdAt?: Date;
  bio?: string;
  iat?: number;
  exp?: number;
}
