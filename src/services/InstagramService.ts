import Axios, { AxiosInstance } from "axios";
import { Service, Inject } from "rakkit";
import { InstagramRequestError } from "../errors";
import { LoginService } from "./LoginService";
import { Timing } from "../utils";

@Service()
export class InstagramService {
  readonly UserInfosQueryHash = "7c16654f22c819fb63d1183034a5162f";
  readonly InstagramLoginUrl = "https://www.instagram.com/accounts/login/ajax/";
  readonly BaseQueryUrl = "graphql/query/?query_hash=";
  readonly BaseUrl = "https://www.instagram.com/";
  readonly Username = "combienrepete";
  readonly Password = "InstaStory00+";
  readonly AxiosInstagram: AxiosInstance;

  @Inject(type => LoginService)
  private _loginService: LoginService;

  private _tries: number;
  private _maxTries: number;

  constructor() {
    this._tries = 0;
    this._maxTries = 5;
    this.AxiosInstagram = Axios.create({
      baseURL: this.BaseUrl
    });
  }

  /**
   * Send a request to the instagram API
   * @param url The url to perform requests
   */
  async makeRequest(url: string) {
    await this._loginService.login();
    try {
      return await this.AxiosInstagram.get(url, {
        headers: {
          Cookie: this.getCookie(
            "sessionid",
            this._loginService.LoggedInfos.sessionId
          )
        }
      });
    } catch (err) {
      if (this._tries < this._maxTries) {
        this._tries++;
        await this._loginService.invalidateSession();
        await Timing.waitFor(10);
        return this.makeRequest(url);
      } else {
        throw new InstagramRequestError(`${this.BaseUrl}${url}`);
      }
    }
  }

  getInstagramQueryUrl(queryHash: string, variables: Object) {
    return `${this.BaseQueryUrl}${queryHash}&variables=${JSON.stringify(variables)}`;
  }

  getCookie(key: string, value: string) {
    return `${key.toLowerCase()}=${value}`;
  }
}
