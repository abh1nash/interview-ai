import AuthController from "./handlers/auth/auth.controller";
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
  {
    path: "/auth/login",
    method: RouteMethod.POST,
    controller: AuthController,
    action: "login",
  },
  {
    path: "/auth/verify/:role",
    method: RouteMethod.GET,
    controller: AuthController,
    action: "verify",
  },
];
