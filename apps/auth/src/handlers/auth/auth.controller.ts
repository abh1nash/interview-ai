import { Response, Request, NextFunction } from "express";
import prisma from "prisma/client";
import argon2 from "argon2";
import { LoginErrorResponseDTO, LoginResponseDTO } from "./auth.dto";
import JwtService from "src/services/jwt.service";

export default class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    if (!email || !password) {
      response
        .status(401)
        .json(new LoginErrorResponseDTO("Invalid credentials."));
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      response
        .status(401)
        .json(new LoginErrorResponseDTO("Invalid credentials."));
      return;
    }
    try {
      const isValid = await argon2.verify(user.passwordHash, password);

      if (!isValid) {
        response
          .status(401)
          .json(new LoginErrorResponseDTO("Invalid credentials."));
        return;
      }
    } catch (error) {
      response
        .status(401)
        .json(new LoginErrorResponseDTO("Invalid credentials."));
      return;
    }

    const token = await JwtService.generate({
      sub: user.id.toString(),
      role: user.role,
    });

    response.status(200).json(new LoginResponseDTO(token, user.role));
  }

  async verify(request: Request, response: Response, next: NextFunction) {
    const { role } = request.params;
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

    if (payload.role !== role) {
      response.sendStatus(403);
      return;
    }
    response.sendStatus(200);
  }
}
