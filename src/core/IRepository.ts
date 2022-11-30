/*eslint-disable*/
import type { Document, Model, UpdateQuery, Query, Types } from 'mongoose';

interface IRead<T extends Document> {
  findById: (
    id?: Types.ObjectId,
    callback?: (error: any, result?: Model<T>) => void
  ) => void;
  findOne: (
    cond?: Object,
    callback?: (err: any, res: T) => void
  ) => Query<T | null, T>;
  find: (
    cond?: Object,
    fields?: Object,
    options?: Object,
    callback?: (err: any, res: T[]) => void
  ) => Query<T[], T>;
}

interface IWrite<T extends Document> {
  create: (
    item?: Query<any[], any, {}, any>,
    callback?: (error: any, result?: T[]) => void
  ) => Query<T[], T>;
  findByIdAndUpdate: (
    _id?: Types.ObjectId,
    item?: UpdateQuery<T>,
    options?: {
      new?: boolean;
      upsert?: boolean;
      runValidators?: boolean;
      setDefaultsOnInsert?: boolean;
      sort?: any;
      select?: any;
      rawResult?: any;
      strict?: any;
    },
    callback?: (error: any, result: Model<T> | null) => any
  ) => any;
  findByIdAndDelete: (
    _id?: Types.ObjectId,
    item?: UpdateQuery<T>,
    options?: {},
    callback?: (error: any, result: Model<T> | null) => any
  ) => any;
}

export { IRead, IWrite };
