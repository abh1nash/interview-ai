import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { routes } from "./routes";
import client from "prom-client";

const app = express();

app.use(express.json());
app.use(cors());

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
  console.log(`Route ${route.method.toUpperCase()} ${route.path} registered.`);
});

app.listen(3000, () => {
  console.log("Auth server running on port 3000.");
});
