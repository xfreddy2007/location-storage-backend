import type { UserType } from '@/types/users';
import { HttpError } from '../../models/http-error';
import { RequestHandler } from 'express';
import crypto, { UUID } from 'crypto';

type UsersControllerKeys = 'getUsers' | 'signup' | 'login';
type UsersControllerType = Record<UsersControllerKeys, RequestHandler>;

const DUMMY_USERS: UserType[] = [
  {
    id: 'aasd-asasdd-assdgsdd-assadadd-qwrfds',
    name: 'Freddy',
    email: 'test@test.com',
    password: 'test1234',
  },
];

const usersController: UsersControllerType = {
  getUsers(req, res, next) {
    return res.json({ users: DUMMY_USERS });
  },
  signup(req, res, next) {
    const { name, email, password }: UserType = req.body;

    const isUserAlreadyExist = !!DUMMY_USERS.find((user) => user.email === email);

    if (isUserAlreadyExist) {
      return new HttpError('Could not create user, email already exists.', 422);
    }

    const createUser: UserType = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    DUMMY_USERS.push(createUser);

    return res.status(201).json({ user: createUser });
  },
  login(req, res, next) {
    const { email, password }: UserType = req.body;

    const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      return new HttpError('Could not identified user, credential seems to be wrong.', 401);
    }

    return res.status(200).json({ message: 'Logged in.' });
  },
};

export default usersController;
