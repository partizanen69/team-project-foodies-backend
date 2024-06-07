import bcrypt from 'bcrypt';

import UserModel from '../db/users.model.js';
import Recipe from '../db/recipe.model.js';
import { generateAvatar, processImage } from '../helpers/processImage.js';
import mongoose from 'mongoose';

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

export const getUserDetailsById = async id => {
  const [user, recipesCount] = await Promise.all([
    UserModel.findById(id)
      .select('name email avatarURL favorites followers following')
      .lean(),
    Recipe.countDocuments({ owner: id }),
  ]);

  return { user, recipesCount };
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
  const convertedFollowingId =
    mongoose.Types.ObjectId.createFromHexString(followingId);
  const convertedId = mongoose.Types.ObjectId.createFromHexString(id);

  const [userFollower, userFollowing] = await Promise.all([
    UserModel.findOneAndUpdate(
      { _id: id },
      { $push: { following: convertedFollowingId } },
      {
        new: true,
      }
    ),
    UserModel.findOneAndUpdate(
      { _id: followingId },
      { $push: { followers: convertedId } },
      {
        new: true,
      }
    ),
  ]);

  return { userFollower, userFollowing };
};

export const deleteFollowing = async ({ id, followingId }) => {
  const convertedFollowingId =
    mongoose.Types.ObjectId.createFromHexString(followingId);
  const convertedId = mongoose.Types.ObjectId.createFromHexString(id);
  const [userFollower, userFollowing] = await Promise.all([
    UserModel.findOneAndUpdate(
      { _id: id },
      { $pull: { following: convertedFollowingId } }
    ),
    UserModel.findOneAndUpdate(
      { _id: followingId },
      { $pull: { followers: convertedId } }
    ),
  ]);
  return { userFollower, userFollowing };
};
