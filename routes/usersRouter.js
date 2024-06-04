import express from 'express';
import validateBody from '../helpers/middlewares/validateBody.js';
import userControllers from '../controllers/usersControllers.js';
import {
  registerUserSchema,
  resendVerificationEmailSchema,
} from '../schemas/usersSchemas.js';
import authenticate from '../helpers/middlewares/authenticate.js';
import upload from '../helpers/middlewares/upload.js';

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  validateBody(registerUserSchema),
  userControllers.registerUser
);

usersRouter.post(
  '/login',
  validateBody(registerUserSchema),
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
