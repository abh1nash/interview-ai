import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/factory";
import { faker } from "@faker-js/faker";
import JwtService from "src/services/jwt.service";

describe("Jobs", () => {
  const factory = new TestFactory();
  beforeAll(async () => {
    await factory.init();
  });
  afterAll(async () => {
    await factory.close();
  });

  test("should create job with title and description", async () => {
    prismaMock.jobs.create.mockResolvedValue({
      id: 1,
      userId: faker.number.bigInt(),
      title: "title",
      description: "description",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });
    const originalVerify = JwtService.verify;
    JwtService.verify = jest.fn().mockResolvedValue({
      sub: faker.number.bigInt(),
      role: "employer",
    });
    const response = await factory.app
      .post("/create")
      .send({
        title: "title",
        description: "description",
      })
      .set("Authorization", "Bearer fake-token-lol");
    JwtService.verify = originalVerify;

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
  });

  test("should list all jobs", async () => {
    prismaMock.jobs.findMany.mockResolvedValue([
      {
        id: 1,
        userId: faker.number.bigInt(),
        title: "Job 1",
        description: "Description 1",
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
      {
        id: 2,
        userId: faker.number.bigInt(),
        title: "Job 2",
        description: "Description 2",
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ]);

    const response = await factory.app
      .get("/list")
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(2);
  });

  test("should list all jobs created by a user", async () => {
    const userId = faker.number.bigInt();
    prismaMock.jobs.findMany.mockResolvedValue([
      {
        id: 1,
        userId: userId,
        title: "Job 1",
        description: "Description 1",
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ]);

    const response = await factory.app
      .get(`/list/user/${userId}`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("should show details of a job based on id", async () => {
    const jobId = 1;

    prismaMock.jobs.findUnique.mockResolvedValue({
      id: jobId,
      userId: faker.number.bigInt(),
      title: "Job 1",
      description: "Description 1",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });

    const response = await factory.app
      .get(`/${jobId}`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("should delete a job", async () => {
    const jobId = 1;
    const userId = BigInt(1);

    prismaMock.jobs.findUnique.mockResolvedValue({
      id: jobId,
      userId: BigInt(1),
      title: "Job Title",
      description: "Job Description",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });

    prismaMock.jobs.delete.mockResolvedValue({
      id: jobId,
      userId,
      title: "To be deleted Job",
      description: "This job has to be deleted.",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });
    const originalVerify = JwtService.verify;
    JwtService.verify = jest.fn().mockResolvedValue({
      sub: userId,
      role: "employer",
    });
    const response = await factory.app
      .delete(`/${jobId}`)
      .set("Authorization", "Bearer fake-token-lol");

    JwtService.verify = originalVerify;
    expect(response.status).toBe(204);
  });

  test("should not allow deleting someone else's job", async () => {
    const jobId = 1;

    prismaMock.jobs.findUnique.mockResolvedValue({
      id: jobId,
      userId: BigInt(1),
      title: "Job Title",
      description: "Job Description",
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    });
    const originalVerify = JwtService.verify;
    JwtService.verify = jest.fn().mockResolvedValue({
      sub: "2",
      role: "employer",
    });
    const response = await factory.app
      .delete(`/${jobId}`)
      .set("Authorization", "Bearer fake-token-lol");

    JwtService.verify = originalVerify;
    expect(response.status).toBe(403);
  });
});
