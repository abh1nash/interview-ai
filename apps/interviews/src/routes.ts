import { InterviewsController } from "./handlers/interviews/interviews.controller";
import { JobsController } from "./handlers/jobs/jobs.controller";
import { QuestionsController } from "./handlers/questions/questions.controller";

export enum RouteMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export type Route = {
  path: string;
  method: RouteMethod;
  controller: any;
  action: string;
};

export const routes: Route[] = [
  {
    path: "/jobs/create",
    method: RouteMethod.POST,
    controller: JobsController,
    action: "create",
  },
  {
    path: "/jobs/list",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "list",
  },
  {
    path: "/jobs/list/user/:userId",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "listByUser",
  },
  {
    path: "/jobs/:id",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "get",
  },
  {
    path: "/jobs/:id",
    method: RouteMethod.DELETE,
    controller: JobsController,
    action: "delete",
  },
  {
    path: "/interviews/:jobId/create",
    method: RouteMethod.POST,
    controller: InterviewsController,
    action: "create",
  },
  {
    path: "/interviews/:jobId",
    method: RouteMethod.GET,
    controller: InterviewsController,
    action: "listByJob",
  },
  {
    path: "/interviews/:interviewId/questions/next",
    method: RouteMethod.GET,
    controller: QuestionsController,
    action: "nextQuestion",
  },
  {
    path: "/questions/:questionId/answer",
    method: RouteMethod.PUT,
    controller: QuestionsController,
    action: "answerQuestion",
  },
];
