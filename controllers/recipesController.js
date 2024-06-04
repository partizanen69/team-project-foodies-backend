import recipesServices from "../services/recipesServices.js";

export const getAllRecipes = async (req, res) => {
    const totalRecipes = await recipesServices.countRecipes(list);
    const list = await recipesServices.recipeList();
  
    res.json({
      total: totalRecipes,
      recepies: list,
    });
};
