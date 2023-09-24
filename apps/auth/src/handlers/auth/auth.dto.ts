export class LoginDTO {
  constructor(public email: string, public password: string) {}
}

export class LoginResponseDTO {
  constructor(public token: string, public role: string) {}
}

export class LoginErrorResponseDTO {
  constructor(public message: string) {}
}
