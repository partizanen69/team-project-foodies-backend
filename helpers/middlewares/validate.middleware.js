import toHttpError from '../HttpError.js';

export const ValidateProp = {
  body: 'body',
  query: 'query',
};

export const validateIncomingPayload = (
  schema,
  bodyOrQuery = ValidateProp.body
) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req[bodyOrQuery]);
    if (error) {
      next(toHttpError(400, error.message));
    }
    next();
  };

  return func;
};
