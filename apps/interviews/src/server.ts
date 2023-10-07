import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { RabbitMQ } from "./services/rabbitmq.service";

const app = express();
app.use(express.json());
app.use(cors());

routes.forEach((route) => {
  app[route.method](route.path, (request, response, next) => {
    const controller = new route.controller();
    controller[route.action](request, response, next);
  });
});

RabbitMQ.initialize();

app.listen(3000, () => {
  console.log("Interviews server running on 3000");
});
