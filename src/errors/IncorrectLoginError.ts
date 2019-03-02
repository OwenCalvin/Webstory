import { LogError } from "./LogError";

export class IncorrectLoginError extends LogError {
  name = "INCORRECT_LOGIN";

  constructor() {
    super("Username or password are incorrect");
  }
}
