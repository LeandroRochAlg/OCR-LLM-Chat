import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Invalid token");
    }

    const [type, token] = authHeader.split(" ");
    if (type.toLowerCase() !== "bearer") {
      throw new UnauthorizedException("Invalid token");
    }

    try {
      const user = await this.authService.validateJwt(token);

      // Attach the user to the request object
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}