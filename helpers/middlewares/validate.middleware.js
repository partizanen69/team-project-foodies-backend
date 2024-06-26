import toHttpError from '../HttpError.js';
import Recipe from '../../db/recipe.model.js';
import User from '../../db/users.model.js';
import { isValidObjectId } from 'mongoose';

export const ValidateProp = {
  body: 'body',
  query: 'query',
  params: 'params',
};

export const validateIncomingPayload = (
  schema,
  bodyOrQuery = ValidateProp.body
) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req[bodyOrQuery]);
    if (error) {
      next(toHttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const validateAddFavoriteRecipe = async (req, _, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    next(toHttpError(400, `${id} is not valid objectid`));
    return;
  }

  const user = await User.findById(owner);
  const recipe = await Recipe.findById(id);

  if (!recipe) {
    next(toHttpError(400, 'Recipe not found'));
    return;
  }
  if (user.favorites.includes(id)) {
    next(toHttpError(400, 'Recipe is already in favorites'));
    return;
  }
  next();
};
