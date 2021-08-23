export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  active?: number;
  activationLink?: string;
  avatarPath?: string;
}
