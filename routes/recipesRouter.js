import express from 'express';
import recipesController from '../controllers/recipesController.js';
import {
  ValidateProp,
  validateIncomingPayload,
  validateAddFavoriteRecipe,
} from '../helpers/middlewares/validate.middleware.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import isEmptyBody from '../helpers/middlewares/isEmptyBody.js';
import isValidMongoId from '../helpers/middlewares/isValidObjectId.js';
import {
  getAllRecipesSchema,
  getMyRecipesSchema,
  getRecipeByIdSchema,
  addRecipeSchema,
  getFavoriteRecipeSchema,
} from '../schemas/recipeSchemas.js';

const recipesRouter = express.Router();

recipesRouter.get(
  '/',
  validateIncomingPayload(getAllRecipesSchema, ValidateProp.query),
  recipesController.getRecipes
);

recipesRouter.get(
  '/my',
  authenticate,
  validateIncomingPayload(getMyRecipesSchema, ValidateProp.query),
  recipesController.getMyRecipes
);

recipesRouter.post(
  '/',
  authenticate,
  upload.single('thumb'),
  isEmptyBody,
  validateIncomingPayload(addRecipeSchema, ValidateProp.body),
  recipesController.addRecipe
);

recipesRouter.get('/popular', recipesController.getPopularRecipes);

recipesRouter.get(
  '/favorites',
  authenticate,
  validateIncomingPayload(getFavoriteRecipeSchema, ValidateProp.query),
  recipesController.getFavoriteRecipes
);

recipesRouter.get(
  '/:id',
  isValidMongoId,
  validateIncomingPayload(getRecipeByIdSchema, ValidateProp.params),
  recipesController.getOneRecipeById
);

recipesRouter.delete('/:id', authenticate, recipesController.deleteRecipe);

recipesRouter.post(
  '/:id/favorites',
  authenticate,
  validateAddFavoriteRecipe,
  recipesController.addFavoriteRecipe
);

recipesRouter.delete(
  '/:id/favorites',
  authenticate,
  isValidMongoId,
  recipesController.deleteFavoriteRecipe
);

export default recipesRouter;
