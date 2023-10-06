import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { listenForReports } from "./services/rabbitmq.service";

const app = express();

app.use(express.json());
app.use(cors());

routes.forEach((route) => {
  app[route.method](route.path, (request, response, next) => {
    const controller = new route.controller();
    controller[route.action](request, response, next);
  });
});

// Start listening for reports
listenForReports();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Reports server running on port ${PORT}`);
});
