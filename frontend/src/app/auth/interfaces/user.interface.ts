export interface User {
  _id?: string;
  sub?: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  birthday?: Date;
  bio?: string;
  profilePictureUrl?: string;
  isActive?: boolean;
  profile: ProfileType;
  createdAt?: Date;
}

export interface UserCredentials {
  emailOrUsername: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  birthday: Date;
  bio?: string;
  profilePicture?: File | null;
}

export type ProfileType = 'user' | 'admin';
