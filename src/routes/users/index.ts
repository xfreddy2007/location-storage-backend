import { Router } from 'express';
import { check } from 'express-validator';
import usersController from '../../controllers/users-controller';

const router: Router = Router();

const { getUsers, signup, login } = usersController;

// Get all the users
router.get('/', getUsers);

// Signup for a single user
router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup,
);

// login for a single user
router.post('/login', login);

export default router;
