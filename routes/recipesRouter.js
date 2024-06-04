import express from 'express';
import recipesController from '../controllers/recipesController.js';
import {
  ValidateProp,
  validateIncomingPayload,
} from '../helpers/middlewares/validate.middleware.js';
import { getAllRecipesSchema } from '../schemas/recipeSchemas.js';

const recipesRouter = express.Router();

recipesRouter.get(
  '/',
  validateIncomingPayload(getAllRecipesSchema, ValidateProp.query),
  recipesController.getRecipes
);

export default recipesRouter;
