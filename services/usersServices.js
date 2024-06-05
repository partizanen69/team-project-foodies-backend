import bcrypt from 'bcrypt';

import UserModel from '../db/users.model.js';
import Recipe from '../db/recipe.model.js';
import { generateAvatar, processAvatar } from '../helpers/processImage.js';

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
  const user = await UserModel.findById(id).select(
    'name email avatarURL favorites followers following'
  );

  const result = {
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    recipesCount: await Recipe.countDocuments({ owner: id }),
  };

  if (!self) {
    return result;
  }

  return {
    ...result,
    favorites: user.favorites.length,
  };
};

export const updateUserById = (id, updatePayload) => {
  return UserModel.updateOne({ _id: id }, updatePayload);
};

export const updateAvatar = async ({ filePath, userId }) => {
  const avatarURL = await processAvatar(filePath, userId);

  await updateUserById(userId, { avatarURL });

  return avatarURL;
};
