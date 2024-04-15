import { ObjectId } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  password: string;
  email: string;
  active?: boolean;
  role: ObjectId;
  pwdRecoveryToken?: string;
  pwdRecoveryDate?: Date;
  extension?: any;
  createdAt?: Date;
  updatedAt?: Date;
  typeObj?: string;
}
