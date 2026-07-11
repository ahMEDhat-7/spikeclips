import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  async register(data: { email: string; password: string }) {
    // TODO: Implement registration with Prisma
    return { message: "Register endpoint", email: data.email };
  }

  async login(data: { email: string; password: string }) {
    // TODO: Implement login with Prisma
    return { message: "Login endpoint", email: data.email };
  }
}
