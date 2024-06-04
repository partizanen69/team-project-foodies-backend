import express from 'express';
import recipesController from '../controllers/recipesController.js';

const recipesRouter = express.Router();

// створити публічний ендпоінт для пошуку рецептів за категорією, інгредієнтом та регіоном походження страви (з урахуванням логіки пагінації)
recipesRouter.get('/', recipesController.getAllRecipes);

export default recipesRouter;
