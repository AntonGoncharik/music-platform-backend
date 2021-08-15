import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.path.includes('auth')) {
      return true;
    }

    try {
      const authHeader = req.headers.authorization;
      const type = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException({
          message: 'User is not logged in',
        });
      }

      // const user = this.jwtService.verify(token);
      // req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'User is not logged in',
      });
    }
  }
}
