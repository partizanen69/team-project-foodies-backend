import Joi from 'joi';

const ObjectId = require('mongoose').Types.ObjectId;

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
  owner: Joi.string().required(),
});

export const addRecipeSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  area: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  time: Joi.string().required(),
  ingredients: Joi.array().required(),
});

export const addFavoriteRecipeSchema = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId Validation').messages({
    'any.invalid': 'Invalid recipe ID format'
  }).required()
});

