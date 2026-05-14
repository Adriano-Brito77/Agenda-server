import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('A variável de ambiente JWT_SECRET não está definida');
    }

    const tokenPayload = jwt.verify(
      request.headers.authorization.split('Bearer ')[1],
      jwtSecret,
    );

    return {
      id: user.sub,
      role: (tokenPayload as jwt.JwtPayload).role,
    };
  },
);
