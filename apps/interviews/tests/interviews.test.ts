import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/factory";
import JwtService from "src/services/jwt.service";
import { faker } from "@faker-js/faker";

describe("Interviews", () => {
  const factory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  test("should create a new interview if none exists", async () => {
    const jobId = faker.number.int();
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });
    prismaMock.interview.findFirst.mockResolvedValue(null);

    prismaMock.interview.create.mockResolvedValue({
      id: faker.number.int(),
      candidateId: faker.number.int(),
      jobId,
      isCompleted: false,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });
    const response = await factory.app
      .post(`/interviews/${jobId}/create`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  test("should return a 400 error if an interview already exists", async () => {
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });

    prismaMock.interview.findFirst.mockResolvedValue({
      id: faker.number.int(),
      candidateId: faker.number.int(),
      jobId: faker.number.int(),
      isCompleted: false,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });

    const response = await factory.app
      .post("/interviews/1/create")
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(400);
  });

  test("should list interviews for a job if authorized", async () => {
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });

    const mockInterviews = [
      {
        id: faker.number.int(),
        candidateId: faker.number.int(),
        jobId: faker.number.int(),
        isCompleted: false,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.number.int(),
        candidateId: faker.number.int(),
        jobId: faker.number.int(),
        isCompleted: true,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ];
    prismaMock.interview.findMany.mockResolvedValue(mockInterviews);

    const response = await factory.app
      .get("/interviews/1")
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(mockInterviews.length);
  });

  test("should return an empty array if not authorized", async () => {
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "2" });

    const response = await factory.app
      .get("/interviews/1")
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });
});
