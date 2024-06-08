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

export default {
    getListIngredients: toController(getListIngredients),
};