import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      const canActivate = await super.canActivate(context);

      if (!canActivate) {
        return false;
      }

      return true;
    } catch (error) {
      if (error.message === 'Unauthorized') {
        const newAccessToken = await this.refreshAccessToken(request);
        response.cookie('authorization', `Bearer ${newAccessToken}`, {
          maxAge: 10000,
          httpOnly: true,
        });
        await super.canActivate(context);
        return true;
      } else {
        throw error;
      }
    }
  }

  async refreshAccessToken(request: Request): Promise<string> {
    try {
      const refreshToken = request.cookies['refreshToken'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      const payload = await this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { user_id: payload.user_id, email: payload.email },
        {
          expiresIn: '10s',
        },
      );

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh access token');
    }
  }
}
