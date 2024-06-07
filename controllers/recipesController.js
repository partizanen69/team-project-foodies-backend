import path from 'path';
import fs from "fs/promises";
import * as recipesServices from '../services/recipesServices.js';
import { toController } from '../utils/api.js';

const getRecipes = async (req, res) => {
  const {
    page: _page = 1,
    limit: _limit = 10,
    category = null,
    area = null,
    ingredients = null
  } = req.query;
  const page = Number(_page);
  const limit = Number(_limit);

  const [recipes, totalRecipes] = await Promise.all([
    recipesServices.getRecipes({
      page,
      limit,
      category,
      area,
      ingredients
    }),
    recipesServices.getAllRecipesCount(),
  ]);

  res.status(200).json({
    recipes,
    page,
    total: totalRecipes,
  });
};

const recipeImagesPath = path.resolve("public", "recipeImages");

const addRecipe = async (req, res) => {
  const recipeData = req.body;
  /* const parsedIngredients = JSON.parse(recipeData.ingredients); */

  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(recipeImagesPath, filename);
  await fs.rename(oldPath, newPath);

  const thumb = path.join("public", "recipeImages", filename); 

  const result = await recipesServices.createRecipe({
    ...recipeData,
    /* ingredients: parsedIngredients, */
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
    ingredients = null
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
      owner
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

export default {
  getRecipes: toController(getRecipes),
  addRecipe: toController(addRecipe),
  addFavoriteRecipe: toController(addFavoriteRecipe),
  getMyRecipes: toController(getMyRecipes)
};
