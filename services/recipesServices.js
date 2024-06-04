import Recipe from '../db/recipe.model.js';

const recipeList = () => Recipe.find();

export default { recipeList };
