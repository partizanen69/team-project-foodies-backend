import { isValidObjectId } from 'mongoose';
import toHttpError from '../HttpError.js';

const isValidMongoId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(toHttpError(400, `${id} is not valid mongo object id`));
  }
  next();
};

export default isValidMongoId;
