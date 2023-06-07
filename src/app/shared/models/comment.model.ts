import { DbUserModel } from './db-user.model';

export interface Comment {
  _id: string;
  user: DbUserModel;
  description: string;
  created: Date;
  updated: Date;
}
