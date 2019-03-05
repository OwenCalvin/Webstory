import {
  Router,
  Post,
  Context,
  Inject,
  UseMiddleware,
  Get
} from "rakkit";
import { UserService } from "../services";
import { UsernameExists } from "../middlewares";
import { AccountModel } from "../models";
import { IGetableUser } from "../types";

@Router("story")
export class StoryRouter {
  @Inject()
  private _userService: UserService;

  @Get("/")
  async getUsers(context: Context) {
    const accounts = await AccountModel.find({
      cache: true
    });
    context.body = accounts.map<IGetableUser>((account) => {
      return {
        id: account.Id,
        userId: account.UserId
      };
    });
  }

  @Post("/")
  @UseMiddleware(UsernameExists)
  async registerUser(context: Context) {
    try {
      const username = context.request.body.username;
      const account = await this._userService.register(username);
      if (account) {
        const getableUser: IGetableUser = {
          id: account.Id,
          userId: account.UserId
        };
        context.body = getableUser;
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
