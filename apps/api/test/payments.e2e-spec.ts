import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("Payments (e2e)", () => {
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

  describe("POST /api/payments/checkout", () => {
    it("rejects checkout without auth", () => {
      return request(app.getHttpServer())
        .post("/api/payments/checkout")
        .send({ plan: "pro", successUrl: "/success", cancelUrl: "/cancel" })
        .expect(401);
    });
  });

  describe("POST /api/payments/webhook", () => {
    it("accepts webhook without JWT auth (public endpoint)", () => {
      return request(app.getHttpServer())
        .post("/api/payments/webhook")
        .set("stripe-signature", "fake-signature")
        .send({ type: "checkout.session.completed" })
        .expect((res) => {
          expect([200, 400]).toContain(res.status);
        });
    });
  });

  describe("GET /api/payments/subscription", () => {
    it("rejects subscription check without auth", () => {
      return request(app.getHttpServer())
        .get("/api/payments/subscription")
        .expect(401);
    });
  });

  describe("POST /api/payments/portal", () => {
    it("rejects portal request without auth", () => {
      return request(app.getHttpServer())
        .post("/api/payments/portal")
        .send({ returnUrl: "/dashboard" })
        .expect(401);
    });
  });
});
