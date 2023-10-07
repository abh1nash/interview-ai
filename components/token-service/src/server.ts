import express, { Request, Response, NextFunction } from "express";
import { routes } from "./routes";
import client from "prom-client";

const app = express();

app.use(express.json());

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (ex) {
    res.sendStatus(500);
  }
});

routes.forEach((route) => {
  app[route.method](
    route.path,
    (request: Request, response: Response, next: NextFunction) => {
      new (route.controller as any)()[route.action](request, response, next);
    }
  );
});

app.listen(3000, () => {
  console.log("Token service running on port 3000.");
});
