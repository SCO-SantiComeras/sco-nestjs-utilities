import * as bcrypt from 'bcrypt';
import { Schema, Types } from 'mongoose';
import { IUser } from '../interface/iuser.interface';
import { MONGODB_CONSTANTS } from '../../mongo-db/mongo-db.constants';

export const USERS_SCHEMA = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    role: { 
      type: Types.ObjectId, 
      ref: MONGODB_CONSTANTS.ROLES.MODEL, 
      required: true
    },
    pwdRecoveryToken: {
      type: String,
      required: false,
      default: null,
    },
    pwdRecoveryDate: {
      type: Date,
      required: false,
      default: null,
    },
    extension: { 
      type: Schema.Types.Mixed,
      required: false,
      default: {},
    },
    typeObj: {
      type: String,
      required: false,
      default: MONGODB_CONSTANTS.USERS.MODEL,
    },
  },
  {
    timestamps: true,
  },
);

USERS_SCHEMA.pre<IUser>('save', async function () {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});
