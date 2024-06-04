import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

// returns Promise
export const compareHash = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const createToken = payload =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

export const verifyToken = token => jwt.verify(token, JWT_SECRET);
