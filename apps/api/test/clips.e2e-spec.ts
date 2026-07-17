import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Clips (e2e)", () => {
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

  describe("GET /api/clips/job/:jobId", () => {
    it("rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .get("/api/clips/job/nonexistent-job-id")
        .expect(401);
    });
  });

  describe("GET /api/clips/:id/download", () => {
    it("rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .get("/api/clips/nonexistent-id/download")
        .expect(401);
    });
  });
});
