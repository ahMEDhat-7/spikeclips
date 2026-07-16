import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/clips/job/:jobId", () => {
    it("returns clips for a job (empty for nonexistent)", () => {
      return request(app.getHttpServer())
        .get("/api/clips/job/nonexistent-job-id")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe("GET /api/clips/:id/download", () => {
    it("returns 404 for nonexistent clip", () => {
      return request(app.getHttpServer())
        .get("/api/clips/nonexistent-id/download")
        .expect(404);
    });
  });

  describe("DELETE /api/clips/:id/music", () => {
    it("rejects music delete without auth", () => {
      return request(app.getHttpServer())
        .delete("/api/clips/nonexistent-id/music")
        .expect(401);
    });
  });

  describe("PUT /api/clips/:id", () => {
    it("rejects clip update without auth", () => {
      return request(app.getHttpServer())
        .put("/api/clips/nonexistent-id")
        .send({ captionText: "Updated" })
        .expect(401);
    });
  });
});
