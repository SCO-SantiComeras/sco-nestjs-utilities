import { Schema, Types } from 'mongoose';
import { MONGODB_CONSTANTS } from '../../mongo-db/mongo-db.constants';
import { IRole } from '../interface/irole.interface';

export const ROLES_SCHEMA = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: { 
      type: [Types.ObjectId], 
      ref: MONGODB_CONSTANTS.PERMISSIONS.MODEL, 
      required: true
    },
    typeObj: {
      type: String,
      required: false,
      default: MONGODB_CONSTANTS.ROLES.MODEL,
    },
  },
  {
    timestamps: true,
  },
);