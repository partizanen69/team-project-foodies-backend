import { ingredientsServices } from '../services/ingredientsServices.js';
import { toController, getPagination } from '../utils/api.js';
import { minusTimestamps } from '../utils/constants.js';

const getListIngredients = async (req, res) => {
    const ingredients = await ingredientsServices.listIngredients({
        fields: minusTimestamps,
        settings: getPagination(req.query),
    });

    res.status(200).json(ingredients);
};

const getIngredientsByName = async (req, res) => {
    const { name } = req.query;
    const ingredients = await ingredientsServices.searchIngredientsByName(name);
    res.status(200).json(ingredients);
};

export const getRecipesByIngredients = async (req, res) => {

    const ingredients = req.query.ingredients.split('"').join('');

    if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients parameter is required' });
    }

    const recipes = await ingredientsServices.searchRecipesByIngredient(ingredients);

    if (recipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found for the given ingredient' });
    }

    res.status(200).json(recipes);
};

export default {
    getListIngredients: toController(getListIngredients),
    getIngredientsByName: toController(getIngredientsByName),
    getRecipesByIngredients: toController(getRecipesByIngredients),
};

