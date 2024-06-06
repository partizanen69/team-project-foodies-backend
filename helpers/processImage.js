import fs from 'fs/promises';
import path from 'path';
import Jimp from 'jimp';
import * as gravatar from 'gravatar';
import HttpError from './HttpError.js';

const publicDir = path.resolve('public');

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
  console.log(tmpPath);
  const extension = tmpPath.split('.').pop();
  const relativePath = `${imageType}s/${identifier}-${imageType}.${extension}`;

  const imagePath = path.join(publicDir, relativePath);

  await fs.rename(tmpPath, imagePath);

  const imageSize = imageType === 'avatar' ? 250 : 550;

  await adjustImage(imagePath, imageSize);

  return relativePath;
};
