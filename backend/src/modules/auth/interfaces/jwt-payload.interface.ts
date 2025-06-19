import { Types } from 'mongoose';

import { Profile } from 'src/modules/users/interfaces/profile.type';

export interface JwtPayload {
  sub: Types.ObjectId;
  username: string;
  profile: Profile;
  iat?: number;
  exp?: number;
}
