import { ObjectId } from 'mongoose';

export interface IRole {
  _id?: string;
  name: string;
  permissions: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  typeObj?: string;
}
