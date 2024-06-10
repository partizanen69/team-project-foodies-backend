import express from 'express';
import recipesController from '../controllers/recipesController.js';
import {
  ValidateProp,
  validateIncomingPayload,
  validateAddFavoriteRecipe
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
  addFavoriteRecipeSchema 
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

recipesRouter.get('/:id',
  isValidMongoId,
  validateIncomingPayload(getRecipeByIdSchema, "params"),
  recipesController.getOneRecipeById
);

recipesRouter.delete('/:id', authenticate, recipesController.deleteRecipe);

recipesRouter.post(
  '/:id/favorites',
  authenticate,
  validateIncomingPayload(addFavoriteRecipeSchema, ValidateProp.body),
  validateAddFavoriteRecipe,
  recipesController.addFavoriteRecipe
);

recipesRouter.get(
  '/favorites',
  authenticate,
  recipesController.getFavoriteRecipes
);

recipesRouter.delete(
  '/:id/favorites',
  authenticate,
  isValidMongoId,
  recipesController.deleteFavoriteRecipe
);

export default recipesRouter;
