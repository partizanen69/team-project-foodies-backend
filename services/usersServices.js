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

export const getManyUsersAndRecipesById = async ({
  id,
  followers,
  maxRecipesCount = 4,
  page,
  limit,
}) => {
  const searchedField = followers ? 'followers' : 'following';

  const convertedUserId = mongoose.Types.ObjectId.createFromHexString(id);

  const numLimit = Number(limit);
  const numPage = Number(page);

  return UserModel.aggregate([
    { $match: { _id: convertedUserId } },
    { $unwind: `$${searchedField}` },
    {
      $lookup: {
        from: 'users',
        localField: searchedField,
        foreignField: '_id',
        as: 'users',
      },
    },
    { $unwind: '$users' },
    {
      $lookup: {
        from: 'recipes',
        localField: 'users._id',
        foreignField: 'owner',
        as: 'usersRecipes',
      },
    },
    {
      $project: {
        _id: '$users._id',
        name: '$users.name',
        avatarURL: '$users.avatarURL',
        recipes: {
          $slice: ['$usersRecipes', maxRecipesCount],
        },
        recipesCount: {
          $size: '$usersRecipes',
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        avatarURL: 1,
        recipesCount: 1,
        isFollowing: 1,
        recipes: {
          $map: {
            input: '$recipes',
            as: 'recipe',
            in: {
              _id: '$$recipe._id',
              title: '$$recipe.title',
              owner: '$$recipe.owner',
              thumb: '$$recipe.thumb',
            },
          },
        },
      },
    },
  ])
    .skip((numPage - 1) * numLimit)
    .limit(numLimit);
};

export const getFollowersAndRecipesById = async ({
  id,
  followers,
  maxRecipesCount = 4,
  page,
  limit,
  currentUserId,
}) => {
  const convertedCurrentUserId =
    mongoose.Types.ObjectId.createFromHexString(currentUserId);

  const [users, currentUser] = await Promise.all([
    getManyUsersAndRecipesById({
      id,
      followers,
      maxRecipesCount,
      page,
      limit,
    }),
    UserModel.findOne({ _id: convertedCurrentUserId }),
  ]);

  return users.map(user => {
    return {
      ...user,
      isFollowing: currentUser.following.includes(user._id),
    };
  });
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
