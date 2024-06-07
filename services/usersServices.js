import bcrypt from 'bcrypt';

import UserModel from '../db/users.model.js';
import Recipe from '../db/recipe.model.js';
import { generateAvatar, processImage } from '../helpers/processImage.js';

export const createUser = async ({ name, email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = generateAvatar(email);

  return UserModel.create({
    name,
    email,
    password: hashPassword,
    avatarURL,
  });
};

export const getUserById = async (id, self = true) => {
  const [user, recipesCount] = await Promise.all([
    UserModel.findById(id)
      .select('name email avatarURL favorites followers following')
      .lean(),
    Recipe.countDocuments({ owner: id }),
  ]);

  const result = {
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    followersCount: user.followers.length,
    recipesCount,
  };

  if (self)
    return {
      ...result,
      followingCount: user.following.length,
      favorites: user.favorites.length,
    };

  return result;
};

export const getOneUser = filter => {
  return UserModel.findOne(filter);
};

export const getManyUsersById = idList => {
  return UserModel.find({ _id: { $in: idList } }).select(
    'name email avatarURL favorites followers following '
  );
};

export const updateUserById = (id, updatePayload) => {
  return UserModel.updateOne({ _id: id }, updatePayload);
};

export const updateAvatar = async ({ filePath, userId }) => {
  const avatarURL = await processImage(filePath, userId, 'avatar');

  await updateUserById(userId, { avatarURL });

  return avatarURL;
};

export const updateFollowing = async ({ id, followingId }) => {
  const [userFollower, _] = await Promise.all([
    UserModel.updateOne({ _id: id }, { $push: { following: followingId } }),
    UserModel.updateOne({ _id: followingId }, { $push: { followers: id } }),
  ]);

  return userFollower;
};

export const deleteFollowing = async ({ id, followingId }) => {
  const [userFollower, _] = await Promise.all([
    UserModel.updateOne({ _id: id }, { $pull: { following: followingId } }),
    UserModel.updateOne({ _id: followingId }, { $pull: { followers: id } }),
  ]);
  return userFollower;
};
