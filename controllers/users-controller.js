const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch {
    return next(
      new HttpError('Something went wrong to signup to database.', 500)
    );
  }
  res
    .status(200)
    .json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    next(new HttpError('Invalid inputs passed, please check your data.', 422));

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch {
    return next(
      new HttpError('Something went wrong to signup to database.', 500)
    );
  }

  if (existingUser)
    return next(
      new HttpError('User exists already, please login instead!', 422)
    );

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch {
    return next(new HttpError('Could not create user. Please try again.', 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  let token;
  try {
    await createdUser.save();
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  let isValidPassword = false;
  let token;
  try {
    existingUser = await User.findOne({ email });
    isValidPassword = await bcrypt.compare(password, existingUser.password);
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch {
    return next(
      new HttpError('Something went wrong to login from database.', 500)
    );
  }
  if (!existingUser) return next(new HttpError('Invalid credentials', 403));

  await res.json({ userId: existingUser.id, email: existingUser.email, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
