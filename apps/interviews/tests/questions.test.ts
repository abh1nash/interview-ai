import { prismaMock } from "prisma/singleton";
import { TestFactory } from "./factory/factory";
import JwtService from "src/services/jwt.service";
import LLMService from "src/services/llm.service";
import { faker } from "@faker-js/faker";

describe("QuestionsController", () => {
  const factory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  test("should get the next question if the interview exists and is not completed", async () => {
    const interviewId = faker.number.int();
    const questionId = faker.number.int();

    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });
    prismaMock.question.findMany.mockResolvedValue([
      {
        id: questionId,
        interviewId,
        question: faker.lorem.sentence(),
        answer: null,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ]);

    prismaMock.interview.findUnique.mockResolvedValue({
      id: interviewId,
      job: {
        description: faker.lorem.paragraph(),
      },
    } as any);

    LLMService.completion = jest
      .fn()
      .mockResolvedValue([{ message: { content: faker.lorem.sentence() } }]);

    const response = await factory.app
      .get(`/interviews/${interviewId}/questions/next`)
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("question");
  });

  test("should save the answer for the question if the question exists", async () => {
    const questionId = faker.number.int();
    const answer = faker.lorem.paragraph();

    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });

    prismaMock.question.findUnique.mockResolvedValue({
      id: questionId,
      question: faker.lorem.sentence(),
      answer: null,
    } as any);

    prismaMock.question.update.mockResolvedValue({
      id: questionId,
      question: faker.lorem.sentence(),
      answer: answer,
    } as any);
    const response = await factory.app
      .put(`/questions/${questionId}/answer`)
      .send({ answer })
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(200);
  });
  test("should return 404 if the question does not exist", async () => {
    const questionId = faker.number.int();
    const answer = faker.lorem.paragraph();

    JwtService.verify = jest.fn().mockResolvedValue({ sub: "1" });
    prismaMock.question.findUnique.mockResolvedValue(null);

    const response = await factory.app
      .put(`/questions/${questionId}/answer`)
      .send({ answer })
      .set("Authorization", "Bearer fake-token-lol");

    expect(response.status).toBe(404);
  });
});
