import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("google")
  async verifyFirebaseToken(@Body() body: { idToken: string }) {
    try {
      if (!body.idToken) {
        throw new UnauthorizedException("Invalid token");
      }

      return this.authService.verifyFirebaseToken(body.idToken);
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}