import path from 'path';
import fs from 'fs/promises';
import * as recipesServices from '../services/recipesServices.js';
import { toController } from '../utils/api.js';
import toHttpError from '../helpers/HttpError.js';

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
    recipesServices.getAllRecipesCount(),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

const recipeImagesPath = path.resolve('public', 'recipeImages');

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
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(recipeImagesPath, filename);
  await fs.rename(oldPath, newPath);

  const thumb = path.join('public', 'recipeImages', filename);

  const result = await recipesServices.createRecipe({
    ...recipeData,
    ingredients: parsedIngredients,
    thumb,
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

  if (recipe.owner.toString() !== owner.toString()) {
    throw toHttpError(403, "You cannot delete another user's recipe");
  }

  await recipesServices.deleteOwnerRecipe({ id, owner });
  res.status(204).send();
};

export default {
  getRecipes: toController(getRecipes),
  addRecipe: toController(addRecipe),
  getPopularRecipes: toController(getPopularRecipes),
  getMyRecipes: toController(getMyRecipes),
  deleteRecipe: toController(deleteRecipe),
};
