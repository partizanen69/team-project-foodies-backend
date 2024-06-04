import UserModel from '../../db/users.model.js';
import toHttpError from '../HttpError.js';
import { verifyToken } from '../auth.js';

const authenticate = async (req, res, next) => {
  const NotAuthorizedError = toHttpError(401, 'Not authorized');

  const { authorization } = req.headers;
  if (!authorization) {
    return next(NotAuthorizedError);
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(NotAuthorizedError);
  }

  try {
    const { id } = verifyToken(token);
    const user = await UserModel.findById(id);
    if (!user) {
      return next(NotAuthorizedError);
    }

    if (!user.token) {
      return next(NotAuthorizedError);
    }

    req.user = user;
    next();
  } catch (error) {
    next(toHttpError(401, error.message));
  }
};

export default authenticate;
