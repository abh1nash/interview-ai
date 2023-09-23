import { Request, Response, NextFunction } from "express";
import prisma from "prisma/client";
import JwtService from "src/services/jwt.service";
import {
  InterviewCreateResponseDTO,
  InterviewErrorResponseDTO,
} from "./interviews.dto";
export class InterviewsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const token = request.get("Authorization")?.split(" ")[1] as string;
    const decodedToken = await JwtService.verify(token);

    const candidateId = parseInt(decodedToken.sub);
    const jobId = parseInt(request.params.jobId);

    // check if user already had an interview for this job
    const existingInterview = await prisma.interview.findFirst({
      where: {
        candidateId,
        jobId,
      },
    });

    if (existingInterview) {
      response
        .status(400)
        .json(
          new InterviewErrorResponseDTO(
            "You have already been a part of an interview for this job."
          )
        );
      return;
    }

    const interview = await prisma.interview.create({
      data: {
        candidateId,
        jobId,
      },
    });

    response.status(201).json(new InterviewCreateResponseDTO(interview.id));
  }

  async listByJob(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.get("Authorization")?.split(" ")[1] as string;
      const decodedToken = await JwtService.verify(token);
      const jobId = parseInt(request.params.jobId);
      const interviews = await prisma.interview.findMany({
        where: {
          jobId,
          job: {
            userId: decodedToken.sub,
          },
        },
      });
      response.status(200).json(
        interviews.map((interview) => ({
          id: interview.id,
          candidateId: interview.candidateId.toString(),
          jobId: interview.jobId,
          isCompleted: interview.isCompleted,
          createdAt: interview.createdAt,
          updatedAt: interview.updatedAt,
        }))
      );
    } catch (err) {
      response.status(200).json([]);
    }
  }
}
