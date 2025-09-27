import { Router } from 'express';
import { UserController } from './users.controller';
import { handleValidationErrors } from '../../middlewares/validation-handler';
import { validatePagination } from '../../validators/pagination';
import { validateCreateUser } from '../../validators/user';

const router = Router();
const userController = new UserController();

router.get(
  '/',
  validatePagination,
  handleValidationErrors,
  userController.getAllUsers,
);

router.post(
  '/',
  validateCreateUser,
  handleValidationErrors,
  userController.createUser,
);

export default router;
