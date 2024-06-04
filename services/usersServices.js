import UserModel from '../db/users.model.js';
import bcrypt from 'bcrypt';

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

export const updateUserById = (id, updatePayload) => {
  return UserModel.updateOne({ _id: id }, updatePayload);
};

export const updateAvatar = async ({ filePath, userId }) => {
  const avatarURL = await processAvatar(filePath, userId);

  await updateUserById(userId, { avatarURL });

  return avatarURL;
};
