import express from 'express';
import recipesController from '../controllers/recipesController.js';

const recipesRouter = express.Router();

recipesRouter.get('/', recipesController.getAllRecipes);

export default recipesRouter;
