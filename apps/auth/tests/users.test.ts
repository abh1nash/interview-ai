import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/TestFactory";
import { faker } from "@faker-js/faker";
import JwtService from "src/services/jwt.service";
import { Role } from "@prisma/client";

describe("Users", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  it("should create a new user", async () => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    prismaMock.user.create.mockResolvedValueOnce({
      name: user.name,
      email: user.email,
      passwordHash: "hashedPasswordMock",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      role: "candidate",
      id: faker.number.int(),
    });

    const originalGenerate = JwtService.generate;
    JwtService.generate = jest.fn().mockResolvedValue("fake-token");

    const response = await factory.app.post("/user/create").send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");

    JwtService.generate = originalGenerate;
  });

  it("should not create a new user if email is already in use", async () => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    prismaMock.user.findUnique.mockResolvedValueOnce({
      name: user.name,
      email: user.email,
      passwordHash: "hashedPasswordMock",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      role: "candidate",
      id: faker.number.int(),
    });
    const response = await factory.app.post("/user/create").send(user);
    expect(response.status).toBe(400);
  });

  it("should return user's details if authenticated", async () => {
    const user = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "candidate" as Role,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      passwordHash: "hashedPasswordMock",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(user);

    const token = "valid-token";
    JwtService.verify = jest
      .fn()
      .mockResolvedValue({ sub: user.id.toString() });

    const response = await factory.app
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", user.name);
    expect(response.body).toHaveProperty("email", user.email);
    expect(response.body).toHaveProperty("id", user.id);
  });

  it("should return 401 if token is not provided", async () => {
    const response = await factory.app.get("/me");
    expect(response.status).toBe(401);
  });

  it("should return 401 if token is invalid", async () => {
    JwtService.verify = jest.fn().mockResolvedValueOnce(null);

    const response = await factory.app
      .get("/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("should return 401 if user does not exist", async () => {
    JwtService.verify = jest
      .fn()
      .mockResolvedValueOnce({ sub: "non-existent-id" });
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const response = await factory.app
      .get("/me")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(401);
  });
});
