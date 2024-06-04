import UserModel from '../db/users.model.js';
import toHttpError from '../helpers/HttpError.js';
import { compareHash, createToken } from '../helpers/auth.js';
import * as userService from '../services/usersServices.js';
import { toController } from '../utils/api.js';

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw toHttpError(409, 'Email in use');
  }

  const newUser = await userService.createUser({ name, email, password });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw toHttpError(401, 'Email or password invalid');
  }

  const isPasswordCorrect = await compareHash(password, user.password);
  if (!isPasswordCorrect) {
    throw toHttpError(401, 'Email or password invalid');
  }

  const token = createToken({
    id: user._id,
  });
  await userService.updateUserById(user._id, { token });

  res.json({
    token,
    user: { name: user.name, email: user.email },
  });
};

const logoutUser = async (req, res) => {
  const user = req.user;
  await userService.updateUserById(user.id, { token: null });
  res.status(204).send();
};

const getCurrentUser = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file?.path) {
    throw toHttpError(400, 'No file found in the request');
  }

  const avatarRelativePath = await userService.updateAvatar({
    filePath: req.file.path,
    userId: req.user.id,
  });
  res.status(200).json({
    avatarURL: avatarRelativePath,
  });
};

const verifyUserEmail = async (req, res) => {
  const verificationToken = req.params.verificationToken;
  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw toHttpError(404, 'User not found');
  }

  await userService.updateUserById(user.id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({
    message: 'Verification successful',
  });
};

export default {
  registerUser: toController(registerUser),
  loginUser: toController(loginUser),
  logoutUser: toController(logoutUser),
  getCurrentUser: toController(getCurrentUser),
  updateAvatar: toController(updateAvatar),
  verifyUserEmail: toController(verifyUserEmail),
};
