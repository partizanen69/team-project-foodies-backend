import express from 'express';
import recipesController from '../controllers/recipesController.js';
import {
  ValidateProp,
  validateIncomingPayload,
} from '../helpers/middlewares/validate.middleware.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import isEmptyBody from '../helpers/middlewares/isEmptyBody.js';
import { getAllRecipesSchema, getMyRecipesSchema } from '../schemas/recipeSchemas.js';
import { addRecipeSchema } from '../schemas/recipeSchemas.js';


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

recipesRouter.get(
  '/popular',
  recipesController.getPopularRecipes
);

export default recipesRouter;
