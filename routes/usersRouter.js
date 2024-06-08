import express from 'express';
import userControllers from '../controllers/usersControllers.js';
import {
  addAndRemoveFollowingSchema,
  loginUserSchema,
  registerUserSchema,
} from '../schemas/usersSchemas.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import { validateIncomingPayload } from '../helpers/middlewares/validate.middleware.js';
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

usersRouter.get('/followers', authenticate, userControllers.getFollowers);

usersRouter.get('/following', authenticate, userControllers.getFollowing);

usersRouter.post(
  '/following',
  authenticate,
  validateIncomingPayload(addAndRemoveFollowingSchema),
  userControllers.addFollowing
);

usersRouter.delete(
  '/following',
  authenticate,
  validateIncomingPayload(addAndRemoveFollowingSchema),
  userControllers.removeFollowing
);

export default usersRouter;
