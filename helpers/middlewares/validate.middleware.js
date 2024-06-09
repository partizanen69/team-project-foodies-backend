import toHttpError from '../HttpError.js';
import Recipe from '../../db/recipe.model.js';
import User from '../../db/users.model.js';

export const ValidateProp = {
  body: 'body',
  query: 'query',
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

export const validateAddFavoriteRecipe = () => {
  const func = async ( req, _, next) => {
    const { _id: owner } = req.user;
    const { id } = req.params;

    const user = await User.findById(owner);
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      next(toHttpError(400, 'Recipe not found'));
    }
    if (user.favorites.includes(id)) {
      next(toHttpError(400, 'Recipe is already in favorites'));
    }
    next()
  }
  
  return func
}
