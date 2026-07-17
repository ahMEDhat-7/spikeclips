import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Jobs (e2e)", () => {
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

  describe("POST /api/jobs", () => {
    it("rejects job creation without auth", () => {
      return request(app.getHttpServer())
        .post("/api/jobs")
        .send({ url: "https://youtube.com/watch?v=test" })
        .expect(401);
    });

    it("rejects job creation with invalid token", () => {
      return request(app.getHttpServer())
        .post("/api/jobs")
        .set("Authorization", "Bearer fake-token")
        .send({ url: "https://youtube.com/watch?v=test" })
        .expect(401);
    });
  });

  describe("GET /api/jobs/:id", () => {
    it("rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .get("/api/jobs/nonexistent-id")
        .expect(401);
    });
  });

  describe("GET /api/jobs/:id/clips", () => {
    it("returns 401 without auth", () => {
      return request(app.getHttpServer())
        .get("/api/jobs/nonexistent-id/clips")
        .expect(401);
    });
  });
});
