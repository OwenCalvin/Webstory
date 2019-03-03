import { Log } from "../utils";

export class LogError extends Error {
  readonly message: string;
  readonly status: number;

  constructor(message: string, status?: number) {
    super();
    this.message = message;
    this.status = status;
    Log.writeLog(this.name, message);
  }
}
