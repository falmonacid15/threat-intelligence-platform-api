import { Prisma, User } from '@prisma/client';
import { logger } from '../../config/logger';
import prisma from '../../lib/prisma';
import { PaginationResponse } from '../../types/pagination';

export class UserService {
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<PaginationResponse<User>> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await prisma.$transaction([
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.user.count(),
      ]);

      logger.info('Users fetched successfully', { service: 'Users Service' });

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching users', error);
      throw error;
    }
  }

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const newUser = await prisma.user.create({ data });

      return {
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      logger.error('Error creating user');
      throw error;
    }
  }
}
