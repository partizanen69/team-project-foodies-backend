import Joi from 'joi';

export const getAllRecipesSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  category: Joi.string(),
  area: Joi.string(),
});

export const getMyRecipesSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  category: Joi.string(),
  area: Joi.string(),
});

export const addRecipeSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.string().required(),
});

