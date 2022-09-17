import { Types } from 'mongoose';
import type { ObjectId, ObjectIdLike } from 'bson';

const isValidObjID = (id: ObjectId | ObjectIdLike | Uint8Array | number | string) =>
  Types.ObjectId.isValid(id);

export default isValidObjID;
