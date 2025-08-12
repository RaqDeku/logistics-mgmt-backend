
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    protected payload: any

    constructor(
        private jwtService: JwtService,
        private authService: AuthService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      this.payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      
      request['user'] = this.payload;
    } catch {
      throw new UnauthorizedException();
    }

    if(!this.isCookieValid) {
        throw new UnauthorizedException()
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type.toLowerCase() === 'Bearer' ? token : undefined;
  }

  private isCookieValid(request: Request): boolean {
    const cookie = request.cookies['_session']

    return this.authService.validateCookie(this.payload.email = "", cookie)
  }
}
