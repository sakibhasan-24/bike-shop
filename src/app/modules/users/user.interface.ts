export interface TUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  isBlocked?: boolean;
}
