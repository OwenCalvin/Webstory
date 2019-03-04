import { Service, Inject } from "rakkit";
import { IsNull, Not } from "typeorm";
import { Subject } from "rxjs";
import { InstagramService } from "./InstagramService";
import { AlreadyExistsError } from "../errors";
import { IUserResponse } from "../types";
import { AccountModel } from "../models";

@Service()
export class UserService {
  @Inject()
  private _instagramService: InstagramService;

  private _registeredSubject: Subject<AccountModel>;
  private _accounts: Map<string, AccountModel>;

  get Accounts(): ReadonlyMap<string, AccountModel> {
    return this._accounts;
  }

  get AccountsValues(): ReadonlyArray<AccountModel> {
    return Array.from(this._accounts.values());
  }

  get RegisteredSubject() {
    return this._registeredSubject;
  }

  constructor() {
    this._registeredSubject = new Subject();
    this._accounts = new Map();
    this.loadAccounts();
  }

  findAccount(compare: (value: AccountModel, index: number) => boolean) {
    return this.AccountsValues.find(compare);
  }

  addAccount(account: AccountModel) {
    this._accounts.set(account.UserId, account);
  }

  removeAccount(userdId: string) {
    this._accounts.delete(userdId);
  }

  async register(username: string): Promise<AccountModel> {
    const userInfos: IUserResponse = await this.getInfos(username);
    if (userInfos) {
      const id = userInfos.graphql.user.id;
      const account = new AccountModel(id);
      try {
        await account.save();
        this._registeredSubject.next(account);
        return account;
      } catch (err) {
        throw new AlreadyExistsError(username, id);
      }
    }
  }

  private async getInfos(username: string) {
    const userInfosEnpoint = `${username}/?__a=1`;
    return (await this._instagramService.makeRequest(userInfosEnpoint)).data;
  }

  private async loadAccounts() {
    const accounts = await AccountModel.find({
      where: {
        _token: Not(IsNull())
      }
    });
    accounts.map(this.addAccount.bind(this));
  }
}
