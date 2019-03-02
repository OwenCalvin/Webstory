import { writeLog } from "../utils";

export class LogError extends Error {
  readonly message: string;
  readonly status: number;

  constructor(message: string, status?: number) {
    super();
    this.message = message;
    this.status = status;
    writeLog(this.name, message);
  }
}
