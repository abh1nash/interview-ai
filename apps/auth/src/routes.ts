import UsersController from "./handlers/users/users.controller";

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
    path: "/user/create",
    method: RouteMethod.POST,
    controller: UsersController,
    action: "create",
  },
];
