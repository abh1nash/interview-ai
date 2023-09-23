import { JobsController } from "src/handlers/jobs/jobs.controller";

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
    path: "/create",
    method: RouteMethod.POST,
    controller: JobsController,
    action: "create",
  },
  {
    path: "/list",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "list",
  },
  {
    path: "/list/user/:userId",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "listByUser",
  },
  {
    path: "/:id",
    method: RouteMethod.GET,
    controller: JobsController,
    action: "get",
  },
  {
    path: "/:id",
    method: RouteMethod.DELETE,
    controller: JobsController,
    action: "delete",
  },
];
