export interface User {
  id?:                string;
  name:               string;
  surname:            string;
  email:              string;
  username:           string;
  password?:          string;
  birthday?:          Date;
  bio?:               string;
  profilePictureUrl?: string;
  isActive?:          boolean;
  isAdmin?:           boolean;
  createdAt?:         Date;
}

export interface UserCredentials {
  emailOrUsername: string;
  password:        string;
}

export interface UserRegistration {
  name:            string;
  surname:         string;
  email:           string;
  username:        string;
  password:        string;
  birthday:        Date;
  bio?:            string;
  profilePicture?: File | null;
}

export type ProfileType = 'user' | 'admin';

export interface UserProfile {
  iss:      string;
  message:  string;
  profile:  ProfileType;
  sub:      string;
  username: string;
}
