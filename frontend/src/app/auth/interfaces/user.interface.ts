export interface User {
  id?: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  password?: string;
  birthday?: Date;
  description?: string;
  profilePictureUrl?: string;
  isActive?: boolean;
  isAdmin?: boolean;
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
  birthday?: Date;
  description?: string;
  profilePicture?: File | null;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  createdAt: Date;
}
