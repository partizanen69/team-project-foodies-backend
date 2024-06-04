import Joi from 'joi';

export const getAllRecipesSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  category: Joi.string(),
  area: Joi.string(),
});
