import Joi from 'joi';

import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const getAllRecipesSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  category: Joi.string(),
  area: Joi.string(),
  ingredients: Joi.string()
});

export const getRecipeByIdSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId Validation')
    .messages({
      'any.invalid': 'Invalid recipe ID format',
    })
    .required(),
});

export const getMyRecipesSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  category: Joi.string(),
  area: Joi.string(),
  ingredients: Joi.string(),
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

export const addFavoriteRecipeSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId Validation')
    .messages({
      'any.invalid': 'Invalid recipe ID format',
    })
    .required(),
});

export const getFavoriteRecipeSchema = Joi.object({
  page: Joi.number(),
  limit: Joi.number(),
  recipeIds: Joi.string(),
});
