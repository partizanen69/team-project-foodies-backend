import express from 'express';
import { toController } from '../utils/api.js';
import { getAllRecipes } from '../controllers/recipesController.js';

const recipesRouter = express.Router();

recipesRouter.get('/', toController(getAllRecipes));

export default recipesRouter;
