import Recipe from "../models/recipe.js";

const recipeList = () => Recipe.find();

export default { recipeList };