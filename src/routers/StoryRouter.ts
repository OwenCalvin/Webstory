import {
  Router,
  Post,
  Context,
  Inject,
  UseMiddleware
} from "rakkit";
import { UserService } from "../services";
import { UsernameExists } from "../middlewares";
import { UserModel } from "../models";

@Router("story")
export class StoryRouter {
  @Inject()
  private _userService: UserService;

  @Post("/")
  @UseMiddleware(UsernameExists)
  async registerUser(context: Context) {
    try {
      const usersCount = await UserModel.count();
      const premium = usersCount < 100;
      const username = context.request.body.username;
      const user = await this._userService.register(username, premium);
      if (user) {
        context.body = user;
      } else {
        context.status = 403;
        context.body = "notfound:username";
      }
    } catch (err) {
      context.status = err.status;
      context.body = err.message;
    }
  }
}
