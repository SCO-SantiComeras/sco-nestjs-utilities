import { ObjectId } from 'mongoose';

export interface IRole {
  _id?: string;
  name: string;
  permissions: ObjectId[];
  typeObj?: string;
}
