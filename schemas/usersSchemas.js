import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'any.required': 'missing required field email',
  }),
});
