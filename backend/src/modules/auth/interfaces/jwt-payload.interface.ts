import mongoose from 'mongoose';

import { Profile } from 'src/modules/users/interfaces/profile.type';

export interface JwtPayload {
  sub: mongoose.Types.ObjectId;
  username: string;
  profile: Profile;
  iat?: number;
  exp?: number;
}
