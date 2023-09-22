import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenGenerateResponseDTO } from "./token.dto";

export class TokenController {
  generate(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    const expiry = request.query.expiry;
    const token = jwt.sign(
      body as JwtPayload,
      (process.env.JWT_SECRET as string) || "",
      {
        expiresIn: (expiry as string) || "1h",
      }
    );
    response.json(new TokenGenerateResponseDTO(token));
  }
  decode(request: Request, response: Response, next: NextFunction) {
    const token = request.query.token as string;
    let payload: JwtPayload | null = {};
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        payload = null;
        return;
      }
      payload = decoded as JwtPayload;
    });
    response.json(payload);
  }
}
