import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/factory";
import JwtService from "src/services/jwt.service";
import { faker } from "@faker-js/faker";

describe("Reports", () => {
  const factory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  test("should list all reports for a specific job", async () => {
    const jobId = faker.number.int();
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });

    const mockReports = [
      {
        id: faker.number.int(),
        interviewId: faker.number.int(),
        employerId: faker.number.int(),
        candidateId: faker.number.int(),
        jobId,
        summary: faker.lorem.sentences(),
        suitabilityScore: faker.number.int({ min: 0, max: 100 }),
        sentimentSummary: faker.lorem.sentence(),
        knowledgeSummary: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.number.int(),
        interviewId: faker.number.int(),
        employerId: faker.number.int(),
        candidateId: faker.number.int(),
        jobId,
        summary: faker.lorem.sentences(),
        suitabilityScore: faker.number.int({ min: 0, max: 100 }),
        sentimentSummary: faker.lorem.sentence(),
        knowledgeSummary: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ];
    prismaMock.report.findMany.mockResolvedValue(mockReports);

    const response = await factory.app
      .get(`/reports/job/${jobId}`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(mockReports.length);
  });

  test("should return a specific report", async () => {
    const reportId = faker.number.int();
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });

    const mockReport = {
      id: reportId,
      interviewId: faker.number.int(),
      employerId: faker.number.int(),
      candidateId: faker.number.int(),
      jobId: faker.number.int(),
      summary: faker.lorem.sentences(),
      suitabilityScore: faker.number.int({ min: 0, max: 100 }),
      sentimentSummary: faker.lorem.sentence(),
      knowledgeSummary: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };
    prismaMock.report.findUnique.mockResolvedValue(mockReport);

    const response = await factory.app
      .get(`/reports/${reportId}`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(reportId);
  });

  test("should return 404 if report does not exist", async () => {
    const reportId = faker.number.int();
    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });
    prismaMock.report.findUnique.mockResolvedValue(null);

    const response = await factory.app
      .get(`/reports/${reportId}`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(404);
  });
});
