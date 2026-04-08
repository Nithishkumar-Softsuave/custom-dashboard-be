import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { IJwtPayload } from './auth.interface';

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: AuthenticatedRequest,
    _: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded = await this.authService.verifyToken(token);
    req.user = decoded;

    next();
  }
}
