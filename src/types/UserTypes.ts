export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface PUser {
  _id: string;
  fullName?: string;
  email?: string;
  profilePicture?: {
    url: string;
  };
  verificationCodeExpiry?: Date;
  isVerified?: boolean;
}
