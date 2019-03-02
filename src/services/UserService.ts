import { Service, Inject } from "rakkit";
import { IsNull, Not } from "typeorm";
import { Subject } from "rxjs";
import { InstagramService } from "./InstagramService";
import { AlreadyExistsError } from "../errors";
import { IUserResponse } from "../types";
import { UserModel } from "../models";

@Service()
export class UserService {
  @Inject()
  private _instagramService: InstagramService;

  private _registeredSubject: Subject<UserModel>;
  private _premiums: Map<string, UserModel>;

  get Premiums(): ReadonlyMap<string, UserModel> {
    return this._premiums;
  }

  get PremiumValues(): ReadonlyArray<UserModel> {
    return Array.from(this.Premiums.values());
  }

  get RegisteredSubject() {
    return this._registeredSubject;
  }

  constructor() {
    this._registeredSubject = new Subject();
    this._premiums = new Map();
    this.loadPremiums();
  }

  addPremium(user: UserModel) {
    this._premiums.set(user.Token, user);
  }

  removePremium(token: string) {
    this._premiums.delete(token);
  }

  async register(username: string, premium?: boolean): Promise<UserModel> {
    const userInfos: IUserResponse = await this.getInfos(username);
    const id = userInfos.graphql.user.id;
    const user = new UserModel(id, premium);
    try {
      await user.save();
      this._registeredSubject.next(user);
      if (user.Premium) {
        this.addPremium(user);
      }
      return user;
    } catch (err) {
      throw new AlreadyExistsError(username, id);
    }
  }

  private async getInfos(username: string) {
    const userInfosEnpoint = `${username}/?__a=1`;
    return (await this._instagramService.makeRequest(userInfosEnpoint)).data;
  }

  private async loadPremiums() {
    const premiums = await UserModel.find({
      where: {
        _token: Not(IsNull())
      }
    });
    premiums.map(this.addPremium.bind(this));
  }
}
