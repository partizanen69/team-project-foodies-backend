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

export const getMyRecipesCount = async ({ owner }) => {
  const count = await Recipe.countDocuments(
    owner ? { owner } : {}
  );
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

export const getRecipeById = async (id) => {
  const recipe = await Recipe.findById(id);
  return recipe;
};

export const deleteOwnerRecipe = async ({ id, owner }) => {
  await Recipe.deleteOne({ _id: id, owner });
};
