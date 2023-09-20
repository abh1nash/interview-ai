import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/TestFactory";
import { faker } from "@faker-js/faker";

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
      id: faker.number.bigInt(),
    });
    const response = await factory.app.post("/user/create").send(user);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
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
      id: faker.number.bigInt(),
    });
    const response = await factory.app.post("/user/create").send(user);
    expect(response.status).toBe(400);
  });
});
