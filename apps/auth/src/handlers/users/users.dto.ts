export class UserCreateRequestDTO {
  constructor(
    public email: string,
    public password: string,
    public name: string,
    public role: "candidate" | "employer"
  ) {}
}

export class UserCreateResponseDTO {
  constructor(public token: string, public email: string) {}
}

export class UserErrorResponseDTO {
  constructor(public message: string) {}
}
