import { NextFunction, Request, Response } from "express";
import prisma from "prisma/client";
import JwtService from "src/services/jwt.service";
import {
  JobCreateResponseDTO,
  JobErrorResponseDTO,
  JobListResponseDTO,
  JobResponseDTO,
} from "./jobs.dto";

export class JobsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.get("Authorization")?.split(" ")[1] as string;
      const decodedToken: { sub: string; role: string } =
        await JwtService.verify(token);

      const { title, description } = request.body;

      if (!title || !description) {
        response
          .status(400)
          .json(new JobErrorResponseDTO("Title and description are required."));
        return;
      }

      const job = await prisma.job.create({
        data: {
          title,
          description,
          userId: parseInt(decodedToken.sub),
        },
      });

      response
        .status(201)
        .json(new JobCreateResponseDTO(job.title, job.description, job.id));
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const jobs = await prisma.job.findMany();
      response.status(200).json(new JobListResponseDTO(jobs).list);
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }

  async listByUser(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = parseInt(request.params.userId);
      const jobs = await prisma.job.findMany({ where: { userId } });
      response.status(200).json(new JobListResponseDTO(jobs).list);
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }

  async get(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const job = await prisma.job.findUnique({ where: { id } });
      if (!job) {
        response.sendStatus(404);
        return;
      }
      response
        .status(200)
        .json(
          new JobResponseDTO(job.title, job.description, job.id, job.createdAt)
        );
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id);
      const token = request.get("Authorization")?.split(" ")[1] as string;
      const decodedToken: { sub: string; role: string } =
        await JwtService.verify(token);
      const job = await prisma.job.findUnique({ where: { id } });

      if (!decodedToken || parseInt(decodedToken.sub) != job?.userId) {
        response.sendStatus(403);
        return;
      }

      if (!job) {
        response.sendStatus(404);
        return;
      }

      await prisma.job.delete({ where: { id } });
      response.sendStatus(204);
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }
}
