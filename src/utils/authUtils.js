const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwtSecret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  JWT_SECRET
};