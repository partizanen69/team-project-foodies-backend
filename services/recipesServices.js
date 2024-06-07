import Recipe from '../db/recipe.model.js';

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

export const getPopularRecipes = async () => {
  const popularRecipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "favorites",
        as: "favoritedBy",
      },
    },
    {
      $addFields: {
        popularity: { $size: "$favoritedBy" },
      },
    },
    {
      $sort: { popularity: -1 },
    },
    {
      $limit: 10,  
    },
  ]);
  return popularRecipes;
};