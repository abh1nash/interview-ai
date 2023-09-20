import jwt, { JwtPayload } from "jsonwebtoken";

export default class JwtService {
  static generate(payload: JwtPayload, expiry: string | number = "2h") {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: expiry,
    });
  }
  static verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}
