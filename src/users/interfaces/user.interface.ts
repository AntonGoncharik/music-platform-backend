export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  avatarUrl?: string;
  activationLink?: string;
}
