import express from "express";
import { routes } from "./routes";

const app = express();
app.use(express.json());

routes.forEach((route) => {
  app[route.method](route.path, (request, response, next) => {
    const controller = new route.controller();
    controller[route.action](request, response, next);
  });
});

app.listen(3003, () => {
  console.log("Interviews server running on 3003");
});
