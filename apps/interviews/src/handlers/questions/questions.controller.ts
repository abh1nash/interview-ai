import { NextFunction, Request, Response } from "express";
import prisma from "prisma/client";
import JwtService from "src/services/jwt.service";
import {
  AnswerMessageDTO,
  QuestionMessageDTO,
  QuestionResponseDTO,
  SystemMessageDTO,
} from "./questions.dto";
import LLMService from "src/services/llm.service";

export class QuestionsController {
  async nextQuestion(request: Request, response: Response, next: NextFunction) {
    const token = request.get("Authorization")?.split(" ")[1] as string;
    const decodedToken = await JwtService.verify(token);

    if (!decodedToken) {
      response.sendStatus(401);
      return;
    }

    const candidateId = parseInt(decodedToken.sub);
    const interviewId = parseInt(request.params.interviewId);

    const questionsSoFar = await prisma.question.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    for (const question of questionsSoFar) {
      if (!question.answer) {
        response
          .status(200)
          .json(new QuestionResponseDTO(question.id, question.question));
        return;
      }
    }

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      include: {
        job: true,
      },
    });

    if (!interview) {
      response.sendStatus(404);
      return;
    }

    // prevent querying llm if interview is completed
    if (interview.isCompleted) {
      response.status(200).json(new QuestionResponseDTO(-1, "[==END==]"));
      return;
    }

    const history: { role: string; content: string }[] = [];
    history.push(new SystemMessageDTO(interview.job.description));

    for (const question of questionsSoFar) {
      history.push(new QuestionMessageDTO(question.question));
      if (question.answer) history.push(new AnswerMessageDTO(question.answer));
    }

    const llmResponse = await LLMService.completion(history);

    const llmResponseContent = llmResponse[0].message.content;

    if (llmResponseContent.endsWith("[==END==]")) {
      await prisma.interview.update({
        where: {
          id: interviewId,
        },
        data: {
          isCompleted: true,
        },
      });
      response.status(200).json(new QuestionResponseDTO(-1, "[==END==]"));
      return;
    }

    const newQuestion = await prisma.question.create({
      data: {
        interviewId,
        question: llmResponse[0].message.content,
      },
    });

    response
      .status(200)
      .json(new QuestionResponseDTO(newQuestion.id, newQuestion.question));
  }

  async answerQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const token = request.get("Authorization")?.split(" ")[1] as string;
    const decodedToken = await JwtService.verify(token);

    const candidateId = parseInt(decodedToken.sub);
    const interviewId = parseInt(request.params.interviewId);

    const questionId = parseInt(request.params.questionId);

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      response.sendStatus(404);
      return;
    }

    if (question.answer) {
      response.sendStatus(400);
      return;
    }

    const answer = request.body.answer;

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        answer,
      },
    });

    response.sendStatus(200);
  }
}
