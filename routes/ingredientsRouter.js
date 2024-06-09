import express from 'express';

import ingredientsControllers from '../controllers/ingredientsControllers.js';

const ingredientsRouter = express.Router();

ingredientsRouter.get('/', ingredientsControllers.getListIngredients);
ingredientsRouter.get('/search', ingredientsControllers.getIngredientsByName);
ingredientsRouter.get('/recipes', ingredientsControllers.getRecipesByIngredients);


export default ingredientsRouter;