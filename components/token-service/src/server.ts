import express, { Request, Response, NextFunction } from "express";
import { routes } from "./routes";

const app = express();

app.use(express.json());

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
