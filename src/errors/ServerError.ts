import { LogError } from "./LogError";

export class ServerError extends LogError {
  name = "SERVER";

  constructor() {
    super("Internal server error", 500);
  }
}
