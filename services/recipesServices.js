import Recipe from '../db/recipe.model.js';

export const getRecipes = async ({ page, limit, category, area, ingredients }) => {
  const recipes = await Recipe.find({
    ...(category ? { category } : null),
    ...(area ? { area } : null),
    ...(ingredients ? { ingredients } : null),
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

export const getMyRecipes = async ({ page, limit, category, area, ingredients, owner }) => {
  const recipes = await Recipe.find({
    ...(category ? { category } : null),
    ...(area ? { area } : null),
    ...(ingredients ? { ingredients } : null),
    ...(owner ? { owner } : null),
  })
    .skip((page - 1) * limit)
    .limit(limit);

  return recipes;
};
