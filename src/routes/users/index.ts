import express, { Router } from 'express';
import usersController from '../../controllers/users-controller';

const router: Router = express.Router();

const { getUsers, signup, login } = usersController;

// Get all the users
router.get('/', getUsers);

// Signup for a single user
router.post('/signup', signup);

// login for a single user
router.post('/login', login);

export default router;
