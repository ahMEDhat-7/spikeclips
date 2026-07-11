import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  async findOne(id: string) {
    // TODO: Implement user lookup with Prisma
    return { id, email: "placeholder@example.com", plan: "free" };
  }
}
