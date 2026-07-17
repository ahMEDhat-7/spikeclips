import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
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
    await app.listen(0);
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
    it("POST /api/jobs rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .post("/api/jobs")
        .send({ url: "https://youtube.com/watch?v=test" })
        .expect(401);
    });

    it("GET /api/jobs/:id rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .get("/api/jobs/nonexistent")
        .expect(401);
    });
  });

  describe("Clips", () => {
    it("GET /api/clips/job/:jobId rejects unauthenticated request", () => {
      return request(app.getHttpServer())
        .get("/api/clips/job/nonexistent")
        .expect(401);
    });
  });
});
