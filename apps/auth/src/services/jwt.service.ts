import { ofetch } from "ofetch";
export default class JwtService {
  static async generate(
    payload: { sub: string; role: string },
    expiry: string | number = "2h"
  ) {
    return await ofetch(
      (process.env.TOKEN_SERVICE_URL as string) + "/token/generate",
      {
        method: "post",
        body: payload,
        query: { expiry },
      }
    );
  }
  static async verify(token: string) {
    return await ofetch(
      (process.env.TOKEN_SERVICE_URL as string) + "/token/decode",
      {
        method: "get",
        query: { token },
      }
    );
  }
}
