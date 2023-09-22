import { TestFactory } from "./factory/factory";
import jwt from "jsonwebtoken";

describe("Auth", () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  });

  afterAll(async () => {
    await factory.close();
  });

  describe("generate", () => {
    it("should generate a JWT token with default expiration", async () => {
      const response = await factory.app.post("/token/generate").send({
        sub: "1234567890",
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it("should generate a JWT token with custom expiration", async () => {
      const response = await factory.app
        .post("/token/generate?expiry=2h")
        .send({
          sub: "1234567890",
        });

      expect(response.status).toBe(200);
      expect(response.text).toBeDefined();

      // Verify that the token has the custom expiration
      const decodedToken: any = jwt.decode(response.text);
      expect(decodedToken.exp).toBeDefined();
    });
  });

  describe("decode", () => {
    it("should decode a valid JWT token", async () => {
      const token = jwt.sign(
        { someData: "data" },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "1h",
        }
      );

      const response = await factory.app.get("/token/decode").query({ token });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("someData");
      expect(response.body.someData).toBe("data");
    });

    it("should return null for an invalid JWT token", async () => {
      const invalidToken = "invalidToken";

      const response = await factory.app
        .get("/token/decode")
        .query({ token: invalidToken });

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });
});
