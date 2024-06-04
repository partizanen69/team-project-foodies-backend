import express from 'express';
import userControllers from '../controllers/usersControllers.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../schemas/usersSchemas.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';
import { validateIncomingPayload } from '../helpers/middlewares/validate.middleware.js';

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

usersRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  userControllers.updateAvatar
);

usersRouter.get('/verify/:verificationToken', userControllers.verifyUserEmail);

export default usersRouter;
