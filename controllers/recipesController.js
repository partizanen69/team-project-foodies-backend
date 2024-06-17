import * as recipesServices from '../services/recipesServices.js';
import { toController } from '../utils/api.js';
import toHttpError from '../helpers/HttpError.js';

import mongoose from 'mongoose';
import cloudinary from '../helpers/cloudinary.js';
const ObjectId = mongoose.Types.ObjectId;

const getRecipes = async (req, res) => {
  const {
    page: _page = 1,
    limit: _limit = 10,
    category = null,
    area = null,
    ingredients = null,
  } = req.query;
  const page = Number(_page);
  const limit = Number(_limit);

  const [recipes, totalRecipes] = await Promise.all([
    recipesServices.getRecipes({
      page,
      limit,
      category,
      area,
      ingredients,
    }),
    recipesServices.getFilteredRecipesCount({ category, area, ingredients }),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

const getOneRecipeById = async (req, res) => {
  const { id } = req.params;

  const recipe = await recipesServices.getRecipeById(id);

  if (!recipe) {
    throw toHttpError(404, 'Recipe not found');
  }

  res.status(200).json(recipe);
};

const addRecipe = async (req, res) => {
  const recipeData = req.body;
  const parsedIngredients = JSON.parse(recipeData.ingredients);

  if (!req.file) {
    throw toHttpError(400);
  }

  if (!recipeData.ingredients) {
    throw toHttpError(400);
  }

  const { _id: owner } = req.user;
  const { path: imagePath } = req.file;

  const uploadResult = await cloudinary.uploader.upload(imagePath, {
    folder: 'recipeImages',
  });

  const result = await recipesServices.createRecipe({
    ...recipeData,
    ingredients: parsedIngredients,
    thumb: uploadResult.url,
    owner,
  });

  res.status(201).json(result);
};

const getMyRecipes = async (req, res) => {
  const { _id: owner } = req.user;
  const {
    page: _page = 1,
    limit: _limit = 10,
    category = null,
    area = null,
    ingredients = null,
  } = req.query;
  const page = Number(_page);
  const limit = Number(_limit);

  const [recipes, totalRecipes] = await Promise.all([
    recipesServices.getMyRecipes({
      page,
      limit,
      category,
      area,
      ingredients,
      owner,
    }),
    recipesServices.getMyRecipesCount({ owner }),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

const addFavoriteRecipe = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;

  const recipe = await recipesServices.addFavoriteRecipe(user, id);
  res.status(201).json(recipe);
};

const getPopularRecipes = async (req, res) => {
  const popularRecipes = await recipesServices.getPopularRecipes();
  res.status(200).json(popularRecipes);
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const recipe = await recipesServices.getRecipeById(id);

  if (!recipe) {
    throw toHttpError(404, 'Recipe not found');
  }

  if (recipe.owner._id.toString() !== owner.toString()) {
    throw toHttpError(403, "You cannot delete another user's recipe");
  }

  await recipesServices.deleteOwnerRecipe({ id, owner });
  res.status(204).send();
};

const getFavoriteRecipes = async (req, res) => {
  const { page = 1, limit = 10, recipeIds: _recipeIds } = req.query;

  let recipeIds;
  if (_recipeIds) {
    try {
      recipeIds = JSON.parse(_recipeIds).forEach(recipeId => {
        if (!ObjectId.isValid(recipeId)) {
          throw new Error(`${recipeId} is not valid mongo object id`);
        }
      });
    } catch (err) {
      throw toHttpError(400, `recipeIds is invalid: ${err.message}`);
    }
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const { _id: owner } = req.user;

  const { favoriteRecipes, totalFavoriteRecipes } =
    await recipesServices.listFavoriteRecipes({
      page: pageNumber,
      limit: limitNumber,
      owner,
      ...(recipeIds ? { recipeIds } : null),
    });

  res.status(200).json({
    recipes: favoriteRecipes,
    page: pageNumber,
    total: totalFavoriteRecipes,
  });
};

const deleteFavoriteRecipe = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  await recipesServices.removeFavoriteRecipe(owner, id);

  res.status(200).json({
    message: `Favorite recipe with id ${id} deleted successfully`,
  });
};

const getRecipesByUserId = async (req, res) => {
  const {
    page: _page = 1,
    limit: _limit = 10,
    category = null,
    area = null,
    ingredients = null,
    owner,
  } = req.query;

  const page = Number(_page);
  const limit = Number(_limit);

  const [recipes, totalRecipes] = await Promise.all([
    recipesServices.getMyRecipes({
      page,
      limit,
      category,
      area,
      ingredients,
      owner,
    }),
    recipesServices.getMyRecipesCount({ owner }),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

export default {
  getRecipes: toController(getRecipes),
  getOneRecipeById: toController(getOneRecipeById),
  addRecipe: toController(addRecipe),
  addFavoriteRecipe: toController(addFavoriteRecipe),
  getMyRecipes: toController(getMyRecipes),
  getPopularRecipes: toController(getPopularRecipes),
  deleteRecipe: toController(deleteRecipe),
  getFavoriteRecipes: toController(getFavoriteRecipes),
  deleteFavoriteRecipe: toController(deleteFavoriteRecipe),
  getRecipesByUserId: toController(getRecipesByUserId),
};
