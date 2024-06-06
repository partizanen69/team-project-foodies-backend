import Favorite from '../db/favorite.model.js';
import { Types } from 'mongoose';

export const addFavorite = async ({ recipe, user }) => {
  const filter = { recipe };

  if (!Types.ObjectId.isValid(recipe)) {
    throw new Error(`Invalid recipe id: ${recipe}`);
  }
  if (!Types.ObjectId.isValid(user)) {
    throw new Error(`Invalid user id: ${user}`);
  }
  const favoriteRecipe = await Favorite.findOne(filter);

  if (favoriteRecipe) {
    if (favoriteRecipe.users.includes(user)) {
      return { message: 'User already in the list' };
    }
    const updatedUsers = [...favoriteRecipe.users, user];
    const resp = await Favorite.findOneAndUpdate(
      filter,
      {
        users: updatedUsers,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return resp ? resp : null;
  } else {
    const resp = await Favorite.create({ users: user, recipe });
    return resp ? resp : null;
  }
};
