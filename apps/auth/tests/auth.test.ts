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

  test("should handle empty email and password fields", async () => {
    const response = await factory.app.post("/auth/login").send({
      email: "",
      password: "",
    });
    expect(response.status).toBe(401);
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
    // Mock JwtService.generate to return a token
    const originalGenerate = JwtService.generate;
    JwtService.generate = jest.fn().mockResolvedValue("fake-token");

    const response = await factory.app.post("/auth/login").send({
      email: "fake@email.com",
      password: "password",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    JwtService.generate = originalGenerate;
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
    const originalGenerate = JwtService.generate;
    JwtService.generate = jest.fn().mockResolvedValue("fake-token");
    const response = await factory.app.post("/auth/login").send({
      email: "fake@email.com",
      password: "wrong password",
    });
    expect(response.status).toBe(401);
    JwtService.generate = originalGenerate;
  });

  test("should not allow login with invalid password hash", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      name: faker.person.fullName(),
      email: "existing@example.com",
      passwordHash: "invalidHash", // Invalid hash format
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      role: "candidate",
      id: faker.number.bigInt(),
    });
    const response = await factory.app.post("/auth/login").send({
      email: "existing@example.com",
      password: "password",
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

    // Mock JwtService.verify to return a promise that resolves with a fake payload
    const originalVerify = JwtService.verify;
    JwtService.verify = jest.fn().mockResolvedValue(payload);

    const originalGenerate = JwtService.generate;
    JwtService.generate = jest.fn().mockResolvedValue("fake-token");

    const token = await JwtService.generate(payload);

    const candidateResponse = await factory.app
      .get("/auth/verify/candidate")
      .set("Authorization", `Bearer ${token}`);
    expect(candidateResponse.status).toBe(200);

    const employerResponse = await factory.app
      .get("/auth/verify/employer")
      .set("Authorization", `Bearer ${token}`);
    expect(employerResponse.status).toBe(403);

    // Restore the original JwtService
    JwtService.verify = originalVerify;
    JwtService.generate = originalGenerate;
  });

  test("should return 401 when Authorization header is missing", async () => {
    const response = await factory.app.get("/auth/verify/candidate");
    expect(response.status).toBe(401);
  });

  test("should return 401 for an invalid token", async () => {
    const invalidToken = "invalid_token_here";

    // Mock JwtService.verify to return a promise that resolves with a fake payload
    const originalVerify = JwtService.verify;
    JwtService.verify = jest.fn().mockResolvedValue(null);
    const response = await factory.app
      .get("/auth/verify/candidate")
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.status).toBe(401);
    // Restore the original JwtService.generate
    JwtService.verify = originalVerify;
  });
});
