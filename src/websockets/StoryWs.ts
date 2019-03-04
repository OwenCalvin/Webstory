import { Websocket, Inject, On, Socket } from "rakkit";
import { UserService } from "../services";

@Websocket()
export class StoryWs {
  @Inject()
  private _userService: UserService;

  @On("subscribe")
  private subscribe(socket: Socket, token: string) {
    const user = this._userService.findPremium((premium) =>
      premium.Token === token
    );
    if (user) {
      user.Socket = socket;
      socket.emit("subscribe", "subscribed");
    } else {
      socket.emit("subscribe", "user not found");
    }
  }

  @On("disconnect")
  private disconnect(socket: Socket) {
    const user = this._userService.findPremium((premium) =>
      premium.Socket === socket
    );
    if (user) {
      user.Socket = undefined;
    }
  }
}
