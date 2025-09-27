import { NextFunction, Request, Response } from 'express';
import { UserService } from './users.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await this.userService.getAllUsers(
        page,
        limit,
        sortBy,
        sortOrder,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.createUser(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
