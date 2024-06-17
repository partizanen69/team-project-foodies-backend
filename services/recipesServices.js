import Recipe from '../db/recipe.model.js';
import User from '../db/users.model.js';
import Area from '../db/area.model.js';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const getRecipes = async ({
  page,
  limit,
  category,
  area,
  ingredients,
}) => {
  let areaName = null;
  let ingredientId = null;

  if (area) {
    const areaDoc = await Area.findById(ObjectId.createFromHexString(area));
    if (areaDoc) {
      areaName = areaDoc.name;
    }
  }

  if (ingredients) {
    ingredientId = ObjectId.createFromHexString(ingredients);
  }

  const matchConditions = {
    ...(category ? { category } : null),
    ...(areaName ? { area: areaName } : null),
    ...(ingredientId ? { 'ingredients.id': ingredientId } : null),
  };

  const recipes = await Recipe.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'favorites',
        as: 'favoritedBy',
      },
    },
    {
      $addFields: {
        popularity: { $size: '$favoritedBy' },
      },
    },
    {
      $sort: { popularity: -1 },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
    {
      $project: {
        favoritedBy: 0,
        popularity: 0,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  return recipes;
};


export const getFilteredRecipesCount = async ({
  category,
  area,
  ingredients,
}) => {
  let areaName = null;
  let ingredientId = null;

  if (area) {
    const areaDoc = await Area.findById(ObjectId.createFromHexString(area));
    if (areaDoc) {
      areaName = areaDoc.name;
    }
  }

  if (ingredients) {
    ingredientId = ObjectId.createFromHexString(ingredients);
  }

  // Create the filter object
  const filter = {
    ...(category ? { category } : null),
    ...(areaName ? { area: areaName } : null),
    ...(ingredientId ? { 'ingredients.id': ingredientId } : null),
  };

  // Get the count of documents matching the filter
  const count = await Recipe.countDocuments(filter);

  return count;
};

export const getAllRecipesCount = async () => {
  const count = await Recipe.countDocuments();
  return Number(count);
};

export const getMyRecipesCount = async ({ owner }) => {
  const count = await Recipe.countDocuments(owner ? { owner } : {});
  return Number(count);
};

export const createRecipe = async data => {
  const recipe = await Recipe.create(data);
  return recipe;
};

export const getPopularRecipes = async () => {
  const popularRecipes = await Recipe.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'favorites',
        as: 'favoritedBy',
      },
    },
    {
      $addFields: {
        popularity: { $size: '$favoritedBy' },
      },
    },
    {
      $sort: { popularity: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
    {
      $project: {
        favoritedBy: 0,
        popularity: 0,
      },
    },
  ]);
  return popularRecipes;
};

export const getMyRecipes = async ({
  page,
  limit,
  category,
  area,
  ingredients,
  owner,
}) => {
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

export const addFavoriteRecipe = async (userId, recipeId) => {
  await User.updateOne(
    { _id: userId },
    { $push: { favorites: ObjectId.createFromHexString(recipeId) } }
  );
  const recipe = await Recipe.findById(recipeId);

  return recipe;
};

export const getRecipeById = async id => {
  const recipe = await Recipe.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'ingredients',
        localField: 'ingredients.id',
        foreignField: '_id',
        as: 'ingr_info',
      },
    },
    {
      $set: {
        ingredients: {
          $map: {
            input: '$ingredients',
            in: {
              $mergeObjects: [
                '$$this',
                {
                  $arrayElemAt: [
                    '$ingr_info',
                    {
                      $indexOfArray: ['$ingr_info._id', '$$this.id'],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $unset: ['ingr_info', 'ingredients.id'],
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
  ]);
  return recipe.length ? recipe[0] : null;
};

export const deleteOwnerRecipe = async ({ id, owner }) => {
  await Recipe.deleteOne({ _id: id, owner });
};

export const listFavoriteRecipes = async ({
  page,
  limit,
  owner,
  recipeIds,
}) => {
  const user = await User.findById(owner).populate({
    path: 'favorites',
    model: Recipe,
    ...(recipeIds && recipeIds.length
      ? { match: { _id: { $in: recipeIds.map(ObjectId.createFromHexString) } } }
      : null),
    options: {
      skip: (page - 1) * limit,
      limit: limit,
    },
  });

  const favoriteRecipes = user.favorites;
  const totalFavoriteRecipes = user.favorites.length;

  return { favoriteRecipes, totalFavoriteRecipes };
};

export const removeFavoriteRecipe = async (owner, recipeId) => {
  const user = await User.findById(owner);
  const index = user.favorites.indexOf(recipeId);
  user.favorites.splice(index, 1);
  await user.save();
};
