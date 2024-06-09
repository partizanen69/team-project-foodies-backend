import express from 'express';
import userControllers from '../controllers/usersControllers.js';
import {
  addAndRemoveFollowingSchema,
  getFollowersAndFollowingSchema,
  loginUserSchema,
  registerUserSchema,
} from '../schemas/usersSchemas.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import {
  ValidateProp,
  validateIncomingPayload,
} from '../helpers/middlewares/validate.middleware.js';
import isValidMongoId from '../helpers/middlewares/isValidObjectId.js';

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  validateIncomingPayload(registerUserSchema),
  userControllers.registerUser
);

usersRouter.post(
  '/login',
  validateIncomingPayload(loginUserSchema),
  userControllers.loginUser
);

usersRouter.post('/logout', authenticate, userControllers.logoutUser);

usersRouter.get('/current', authenticate, userControllers.getCurrentUser);

usersRouter.get(
  '/user-details/:id',
  authenticate,
  isValidMongoId,
  userControllers.getUserDetails
);

usersRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  userControllers.updateAvatar
);

usersRouter.get(
  '/followers',
  validateIncomingPayload(getFollowersAndFollowingSchema, ValidateProp.query),
  authenticate,
  userControllers.getFollowers
);

usersRouter.get(
  '/following',
  validateIncomingPayload(getFollowersAndFollowingSchema, ValidateProp.query),
  authenticate,
  userControllers.getFollowing
);

usersRouter.post(
  '/following',
  authenticate,
  validateIncomingPayload(addAndRemoveFollowingSchema, ValidateProp.body),
  userControllers.addFollowing
);

usersRouter.delete(
  '/following',
  authenticate,
  validateIncomingPayload(addAndRemoveFollowingSchema, ValidateProp.body),
  userControllers.removeFollowing
);

export default usersRouter;
