import { Request, Response, NextFunction } from "express";
import prisma from "prisma/client";
import argon2 from "argon2";
import {
  UserCreateRequestDTO,
  UserCreateResponseDTO,
  UserErrorResponseDTO,
} from "./users.dto";
import JwtService from "src/services/jwt.service";

export default class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, password, role } =
      request.body as UserCreateRequestDTO;
    if (!name || !email || !password) {
      response
        .status(400)
        .json(new UserErrorResponseDTO("Missing required fields."));
      return;
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      response
        .status(400)
        .json(new UserErrorResponseDTO("Email already in use."));
      return;
    }
    const hash = await argon2.hash(password);

    try {
      const newUser = await prisma.user.create({
        data: { name, email, passwordHash: hash, role },
      });
      const token = await JwtService.generate({
        sub: newUser.id.toString(),
        role: newUser.role,
      });
      response.status(201).json(new UserCreateResponseDTO(token, email));
    } catch (error) {
      response
        .status(500)
        .json(new UserErrorResponseDTO("Something went wrong."));
      return;
    }
  }

  async me(request: Request, response: Response, next: NextFunction) {
    const token = request.get("Authorization")?.split(" ")[1];
    if (!token) {
      response.sendStatus(401);
      return;
    }
    const payload = await JwtService.verify(token);
    if (!payload) {
      response.sendStatus(401);
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.sub) },
    });
    if (!user) {
      response.sendStatus(401);
      return;
    }
    response.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      id: parseInt(user.id.toString()),
    });
  }
}
