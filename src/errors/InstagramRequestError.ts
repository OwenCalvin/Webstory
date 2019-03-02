import { LogError } from "./LogError";

export class InstagramRequestError extends LogError {
  name = "INSTAGRAM_REQUEST";

  constructor(url: string) {
    super(`Instagram request error to: "${url}"`, 500);
  }
}
