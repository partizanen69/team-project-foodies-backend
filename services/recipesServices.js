import Recipe from '../db/recipe.model.js';
import User from '../db/users.model.js';

export const getRecipes = async ({ page, limit, category, area }) => {
  const recipes = await Recipe.find({
    ...(category ? { category } : null),
    ...(area ? { area } : null),
  })
    .skip((page - 1) * limit)
    .limit(limit);

  return recipes;
};

export const getAllRecipesCount = async () => {
  const count = await Recipe.countDocuments();
  return Number(count);
};

export const createRecipe = async(data) => {
  const recipe = await Recipe.create(data);
  return recipe;
};

export const addFavoriteRecipe = async (userId, recipeId) => {
  const user = await User.findById(userId);
  const recipe = await Recipe.findById(recipeId);
  
  user.favorites.push(recipeId);
  await user.save();

  return recipe;
};
