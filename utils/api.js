export const toController = func => {
  return async (req, res, next) => {
    try {
      await func(req, res);
    } catch (err) {
      console.error('Controller handler failed with error: ', err);
      next(err);
    }
  };
};

export const getPagination = requestQuery => {
  if (!('page' in requestQuery) && !('limit' in requestQuery)) {
    return {};
  }

  const { page = 1, limit = 200 } = requestQuery;
  const skip = (page - 1) * limit;
  return { skip, limit };
};
