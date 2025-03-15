import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FirebaseAdminService } from "../config/firebase-admin.config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private firebaseAdmin: FirebaseAdminService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async verifyFirebaseToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseAdmin
        .getAdmin()
        .auth()
        .verifyIdToken(idToken);

        // Search for the user in the database or create a new one
        const user = await this.findOrCreateUser(decodedToken);

        // Generate a JWT token
        const token = this.jwtService.sign({
          sub: user.id,
          email: user.email,
        });

        return {
          user,
          token,
        };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async findOrCreateUser(decodedToken: any) {
    // Find the user by the email
    let user = await this.prisma.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });

    // If the user is not found, create a new one
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: decodedToken.email,
          name: decodedToken.name,
          avatar: decodedToken.picture,
          firebaseUid: decodedToken.uid
        },
      });
    }

    return user;
  }

  async validateJwt(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}