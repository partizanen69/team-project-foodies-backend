import fs from 'fs/promises';
import Jimp from 'jimp';
import * as gravatar from 'gravatar';
import HttpError from './HttpError.js';
import cloudinary from './cloudinary.js';

export const generateAvatar = email => {
  const avatarURL = gravatar.url(email, {
    d: 'retro',
    protocol: 'https',
  });

  return avatarURL;
};

const adjustImage = async (imagePath, imageSize) => {
  try {
    const jimpImgObject = await Jimp.read(imagePath);

    await jimpImgObject
      .cover(
        imageSize,
        imageSize,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .write(imagePath);
  } catch (error) {
    throw HttpError(400, error.message);
  }
};

export const processImage = async (tmpPath, identifier, imageType) => {
  const imageSize = imageType === 'avatar' ? 250 : 550;
  await adjustImage(tmpPath, imageSize);

  const uploadResult = await cloudinary.uploader.upload(tmpPath, {
    folder: 'avatars',
  });
  await fs.unlink(tmpPath);

  return uploadResult.url;
};
