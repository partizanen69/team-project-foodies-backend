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
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  });
};

const logoutUser = async (req, res) => {
  const user = req.user;
  await userService.updateUserById(user.id, { token: null });
  res.status(204).send();
};

const getCurrentUser = (req, res) => {
  const { _id, name, email, avatarURL } = req.user;
  res.status(200).json({
    id: _id,
    name,
    email,
    avatarURL,
  });
};

const getUserDetails = async (req, res) => {
  const targetUserId = req.params.id;

  const { user, recipesCount } = await userService.getUserDetailsById(
    targetUserId
  );

  if (!user) {
    throw toHttpError(404, 'User not found');
  }

  const result = {
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    followersCount: user.followers.length,
    recipesCount,
  };

  if (targetUserId === req.user._id.toString()) {
    result.followingCount = user.following.length;
    result.favorites = user.favorites.length;
  }

  res.status(200).json({
    result,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file?.path) {
    throw toHttpError(400, 'No file found in the request');
  }

  const avatarURL = await userService.updateAvatar({
    filePath: req.file.path,
    userId: req.user.id,
  });

  res.status(200).json({
    avatarURL,
  });
};

const getFollowers = async (req, res) => {
  const user = req.user;
  const { page = 1, limit = 9 } = req.query;

  const followers = await userService.getManyUsersAndRecipesById({
    id: user._id,
    followers: true,
    page,
    limit,
  });

  res.status(200).json({ followers, page, total: user.followers.length });
};

const getFollowing = async (req, res) => {
  const user = req.user;
  const { page = 1, limit = 9 } = req.query;

  const following = await userService.getManyUsersAndRecipesById({
    id: user._id,
    followers: false,
    page,
    limit,
  });

  res.status(200).json({ following, page, total: user.following.length });
};

const addFollowing = async (req, res) => {
  const { followingId } = req.body;
  const user = req.user;

  const followingUser = await userService.getOneUser({ _id: followingId });

  if (!followingUser) {
    throw toHttpError(404, 'Following user not found');
  }

  if (user.following.includes(followingId)) {
    throw toHttpError(409, 'Already following');
  }

  const updatedUsers = await userService.updateFollowing({
    id: user.id,
    followingId: followingId,
  });

  res.status(201).json({ following: updatedUsers.userFollower.following });
};

const removeFollowing = async (req, res) => {
  const { followingId } = req.body;
  const user = req.user;

  if (!user.following.includes(followingId)) {
    throw toHttpError(404, "Already doesn't follow");
  }

  const updatedUsers = await userService.deleteFollowing({
    id: user.id,
    followingId: followingId,
  });

  res.status(201).json({ following: updatedUsers.userFollower.following });
};

export default {
  registerUser: toController(registerUser),
  loginUser: toController(loginUser),
  logoutUser: toController(logoutUser),
  getCurrentUser: toController(getCurrentUser),
  updateAvatar: toController(updateAvatar),
  getUserDetails: toController(getUserDetails),
  getFollowers: toController(getFollowers),
  getFollowing: toController(getFollowing),
  addFollowing: toController(addFollowing),
  removeFollowing: toController(removeFollowing),
};
