import Joi from 'joi';
import { emailRegExp } from '../utils/constants.js';

import mongoose from 'mongoose';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required().email(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().email(),
  password: Joi.string().required(),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'any.required': 'missing required field email',
  }),
});

export const addAndRemoveFollowingSchema = Joi.object({
  followingId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId Validation')
    .messages({
      'any.invalid': 'Invalid following user ID format',
    })
    .required(),
});
