import { Profile } from 'src/modules/users/interfaces/profile.type';

export interface JwtPayload {
  username: string;
  profile: Profile;
  joinDate: Date;
  iat?: number;
  exp?: number;
}
