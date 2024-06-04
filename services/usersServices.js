import UserModel from '../db/users.model.js';
import fsPromises from 'fs/promises';
import bcrypt from 'bcrypt';
import path from 'path';
import * as gravatar from 'gravatar';
import jimp from 'jimp';
import { nanoid } from 'nanoid';

export const createUser = async ({ email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);

  return UserModel.create({
    email,
    password: hashPassword,
    avatarURL: gravatar.url(email, {
      protocol: 'https',
    }),
    verificationToken: nanoid(),
  });
};

export const updateUserById = (id, updatePayload) => {
  return UserModel.updateOne({ _id: id }, updatePayload);
};

export const updateAvatar = async ({ filePath, userId }) => {
  const extension = filePath.split('.').pop();
  const relativePath = `avatars/${userId}-avatar.${extension}`;
  const userAvatarPath = path.resolve(`public/${relativePath}`);

  const jimpImgObject = await jimp.read(filePath);
  await jimpImgObject.resize(250, 250).write(userAvatarPath);

  await updateUserById(userId, { avatarURL: relativePath });
  await fsPromises.unlink(filePath);

  return relativePath;
};
