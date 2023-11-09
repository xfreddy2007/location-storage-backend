import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import User, { type UserType } from '../../models/user';

type UsersControllerKeys = 'getUsers' | 'signup' | 'login';
type UsersControllerType = Record<UsersControllerKeys, RequestHandler>;

const usersController: UsersControllerType = {
  async getUsers(req, res, next) {
    let users;
    try {
      users = await User.find({}, '-password');
    } catch (err) {
      return next(new HttpError('Fetching users failed, please try again later.', 500));
    }

    return res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  },
  async signup(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { name, email, password }: UserType = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if (existingUser) {
      return next(new HttpError('User exists already, please login instead.', 422));
    }

    const createdUser = new User({
      name,
      email,
      image: 'aaa',
      password,
      places: [],
    });

    // add places
    try {
      await createdUser.save();
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    return res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  },
  async login(req, res, next) {
    const { email, password }: UserType = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
      return next(new HttpError('Could not identified user, credential seems to be wrong.', 401));
    }

    return res.status(200).json({ message: 'Logged in.' });
  },
};

export default usersController;
