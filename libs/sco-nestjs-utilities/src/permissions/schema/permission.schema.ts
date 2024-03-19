import { Schema } from 'mongoose';
import { MONGODB_CONSTANTS } from '../../mongo-db/mongo-db.constants';
import { IPermission } from '../interface/ipermission.interface';

export const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    typeObj: {
      type: String,
      required: false,
      default: MONGODB_CONSTANTS.PERMISSIONS.MODEL,
    },
  },
  {
    timestamps: true,
  },
);