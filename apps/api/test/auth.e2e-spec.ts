import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Auth (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/auth/logout", () => {
    it("allows logout without auth (public endpoint)", () => {
      return request(app.getHttpServer())
        .post("/api/auth/logout")
        .expect(200);
    });
  });

  describe("GET /api/auth/me", () => {
    it("rejects profile request without token", () => {
      return request(app.getHttpServer())
        .get("/api/auth/me")
        .expect(401);
    });

    it("rejects profile request with invalid token", () => {
      return request(app.getHttpServer())
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });
});
