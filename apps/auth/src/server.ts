import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { routes } from "./routes";

const app = express();

app.use(bodyParser.json());

routes.forEach((route) => {
  app[route.method](
    route.path,
    (request: Request, response: Response, next: NextFunction) => {
      new (route.controller as any)()[route.action](request, response, next);
    }
  );
});

app.listen(3000, () => {
  console.log("Auth server running on port 3000.");
});
