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
