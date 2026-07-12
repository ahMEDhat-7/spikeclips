import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
    );
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe("Health", () => {
    it("GET /api/health returns ok", () => {
      return request(app.getHttpServer())
        .get("/api/health")
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe("ok");
          expect(res.body.timestamp).toBeDefined();
          expect(res.body.uptime).toBeGreaterThan(0);
        });
    });
  });

  describe("Jobs", () => {
    it("POST /api/jobs rejects invalid URL", () => {
      return request(app.getHttpServer())
        .post("/api/jobs")
        .send({ url: "not-a-url", userId: "user-1" })
        .expect(400);
    });

    it("POST /api/jobs rejects missing fields", () => {
      return request(app.getHttpServer())
        .post("/api/jobs")
        .send({})
        .expect(400);
    });

    it("GET /api/jobs/:id returns 400 for invalid UUID format with non-existent job", () => {
      return request(app.getHttpServer())
        .get("/api/jobs/nonexistent")
        .expect(404);
    });
  });

  describe("Clips", () => {
    it("GET /api/clips/job/:jobId returns empty array for non-existent job", () => {
      return request(app.getHttpServer())
        .get("/api/clips/job/nonexistent")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
