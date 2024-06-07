import express from 'express';
import recipesController from '../controllers/recipesController.js';
import {
  ValidateProp,
  validateIncomingPayload,
  valdateAddFavoriteRecipe
} from '../helpers/middlewares/validate.middleware.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import isEmptyBody from '../helpers/middlewares/isEmptyBody.js';
import { 
  getAllRecipesSchema, 
  getMyRecipesSchema,
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

recipesRouter.post(
  '/:id/favorites',
  authenticate,
  validateIncomingPayload(addFavoriteRecipeSchema, ValidateProp.body),
  valdateAddFavoriteRecipe,
  recipesController.addFavoriteRecipe
);

export default recipesRouter;
