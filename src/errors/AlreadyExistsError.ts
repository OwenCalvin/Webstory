import { LogError } from "./LogError";

export class AlreadyExistsError extends LogError {
  name = "ALREADY_EXISTS";

  constructor(username: string, userId: string) {
    super(
      `The username "${username}" with the id "${userId}" already exists`,
      403
    );
  }
}
