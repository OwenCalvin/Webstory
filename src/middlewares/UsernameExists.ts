import {
  IBaseMiddleware,
  BeforeMiddleware,
  Context,
  NextFunction
} from "rakkit";

@BeforeMiddleware()
export class UsernameExists implements IBaseMiddleware {
  async use(context: Context, next: NextFunction) {
    const username = context.request.body.username;
    if (username) {
      await next();
    } else {
      context.status = 403;
      context.body = "fill:username";
    }
  }
}
