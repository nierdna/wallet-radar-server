import { UserRepository } from '@/database/repositories';
import { TJWTPayload } from '@/shared/types';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  @Inject(UserRepository)
  private userRepository: UserRepository;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Chỉ bypass kiểm tra token cho endpoint /blogs
    if (process.env.APP_ENV === 'local') {
      return true;
    }

    if (token) {
      try {
        const payload: TJWTPayload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        if (
          !(await this.userRepository.exist({
            where: { address: payload.sub },
          }))
        ) {
          throw {
            status_code: HttpStatus.UNAUTHORIZED,
            message: `Not found user`,
          };
        }
        request['user'] = { ...payload };
      } catch (err) {
        throw new UnauthorizedException({
          status_code: HttpStatus.UNAUTHORIZED,
          ...err,
        });
      }
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
