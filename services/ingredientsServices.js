import mongoose from 'mongoose';
import Ingredient from '../db/ingredient.modal.js';
import Recipe from '../db/recipe.model.js';

const { ObjectId } = mongoose.Types;

export const searchRecipesByIngredient = async (ingredientName) => {

    const searchIngredient = await Ingredient.find({
        name: { $regex: ingredientName, $options: "i" },
    });

    if (!searchIngredient.length) {
        return []; 
    }

    const idIngredients = searchIngredient.map(({ _id }) => _id);

    const objectIdIngredients = idIngredients.map(id => new ObjectId(id));

    const result = await Recipe.find({
        'ingredients.id': { $in: objectIdIngredients },
    });

    return result;
};

export const listIngredients = async (searchOptions = {}) => {
    const { filter = {}, fields = '', settings = {} } = searchOptions;
    const result = await Ingredient.find(filter, fields, settings);
    return result;
};

export const searchIngredientsByName = async (name) => {
    const result = await Ingredient.find({
        name: { $regex: name, $options: "i" },
    });
    
    return result;
};

export const ingredientsServices = {
    searchRecipesByIngredient,
    listIngredients,
    searchIngredientsByName,
};