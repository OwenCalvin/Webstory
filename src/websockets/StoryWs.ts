import { Websocket, Inject, On, Socket } from "rakkit";
import { UserService } from "../services";

@Websocket()
export class StoryWs {
  @Inject()
  private _userService: UserService;

  @On("subscribe")
  private subscribe(socket: Socket, userIds: string[] | string) {
    const userIdsArr: string[] = Array.isArray(userIds) ? userIds : [ userIds ];
    const subscriptions = this._userService.AccountsValues.reduce<string[]>((prev, account) => {
      if (userIdsArr.includes(account.UserId)) {
        if (!account.Sockets.includes(socket)) {
          account.Sockets.push(socket);
        }
        return [
          ...prev,
          account.UserId
        ];
      }
      return prev;
    }, []);
    socket.emit("subscribe", subscriptions);
  }

  @On("disconnect")
  private disconnect(socket: Socket) {
    this._userService.AccountsValues.map((account) => {
      const index = account.Sockets.indexOf(socket);
      if (index > -1) {
        account.Sockets.splice(index, 1);
      }
    });
  }
}
