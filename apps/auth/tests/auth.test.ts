import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/TestFactory";
import { faker } from "@faker-js/faker";
import JwtService from "src/services/jwt.service";

describe("Auth", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  test("should allow login with valid credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      name: faker.person.fullName(),
      email: "fake@email.com",
      passwordHash:
        "$argon2id$v=19$m=16,t=2,p=1$bmExQVdjcjZPTko4Zk5MTg$nYnH9f/77njwrCcc1+4g7Q", // password
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      role: "candidate",
      id: faker.number.bigInt(),
    });
    const response = await factory.app.post("/auth/login").send({
      email: "fake@email.com",
      password: "password",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should not allow login with invalid credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      name: faker.person.fullName(),
      email: "fake@email.com",
      passwordHash:
        "$argon2id$v=19$m=16,t=2,p=1$bmExQVdjcjZPTko4Zk5MTg$nYnH9f/77njwrCcc1+4g7Q", // password
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      role: "candidate",
      id: faker.number.bigInt(),
    });
    const response = await factory.app.post("/auth/login").send({
      email: "fake@email.com",
      password: "wrong password",
    });
    expect(response.status).toBe(401);
  });

  test("should not allow login with invalid email", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    const response = await factory.app.post("/auth/login").send({
      email: faker.internet.email(),
      password: "password",
    });
    expect(response.status).toBe(401);
  });

  test("should verify user role", async () => {
    const payload = {
      sub: "1",
      role: "candidate",
    };
    const token = JwtService.generate(payload);

    const candidateResponse = await factory.app
      .get("/auth/verify/candidate")
      .set("Authorization", `Bearer ${token}`);
    expect(candidateResponse.status).toBe(200);

    const employerResponse = await factory.app
      .get("/auth/verify/employer")
      .set("Authorization", `Bearer ${token}`);
    expect(employerResponse.status).toBe(401);
  });
});
