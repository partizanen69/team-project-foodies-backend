import Ingredient from '../db/ingredient.modal.js';

export const listIngredients = async (searchOptions = {}) => {
    const { filter = {}, fields = '', settings = {} } = searchOptions;
    const result = await Ingredient.find(filter, fields, settings);
    return result;
};

export const ingredientsServices = {
    listIngredients,
};