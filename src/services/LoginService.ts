import { Service, Inject } from "rakkit";
import { AxiosResponse } from "axios";
import { Subject } from "rxjs";
import * as qs from "qs";
import { InstagramRequestError, IncorrectLoginError } from "../errors";
import { ILoggedInfos, ICookie, ILoggedResponse } from "../types";
import { InstagramService } from ".";

@Service()
export class LoginService {
  // Circular dependencie
  @Inject(type => InstagramService)
  private _instagramService: InstagramService;

  private _sessionId: string;
  private _CsrfToken: string;
  private _loggedInfos?: ILoggedInfos;
  private _loggedSubject: Subject<ILoggedInfos>;

  /**
   * Informations about the current logged session
   */
  get LoggedInfos() {
    return this._loggedInfos;
  }

  constructor() {
    this._loggedSubject = new Subject();
  }

  /**
   * You need to be legged to perform rquest to the instagram private API
   * It sends a login request to get the SessionID. With it you can perform any request.
   */
  async login(): Promise<ILoggedInfos | undefined> {
    if (!this.LoggedInfos) {
      let loginResponse: AxiosResponse<ILoggedResponse>;
      try {
        loginResponse = await this._instagramService.AxiosInstagram.post(
        this._instagramService.InstagramLoginUrl,
        qs.stringify({
          username:	this._instagramService.Username,
          password: this._instagramService.Password,
          queryParams: {source: "auth_switcher"}
        }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": "."
          }
        });
      } catch (err) {
        throw new InstagramRequestError(this._instagramService.InstagramLoginUrl);
      }
      if (loginResponse.data.authenticated) {
        const setCookies = loginResponse.headers["set-cookie"];
        // Get the sessionid cookie to make requests
        this._sessionId = this.findSetCookieValue(setCookies, "sessionid").value;
        this._loggedInfos = {
          sessionId: this._sessionId,
          csrf: this._CsrfToken,
          date: new Date()
        };
        this._loggedSubject.next(this._loggedInfos);
        return this._loggedInfos;
      } else {
        throw new IncorrectLoginError();
      }
    }
    return this._loggedInfos;
  }

  /**
   * Reset the sessions informations and relog
   */
  async invalidateSession() {
    this._loggedInfos = undefined;
    return this.login();
  }

  /**
   * Get the CSRF token into the set-cookie header
   */
  private async getCsrfToken() {
    const insta = await this._instagramService.AxiosInstagram.get("accounts/login/?source=auth_switcher", {
      headers: {
        Cookie: this._instagramService.getCookie("ig_cb", "1")
      }
    });
    const setCookies: string[] = insta.headers["set-cookie"];
    return this.findSetCookieValue(setCookies, "csrf");
  }

  /**
   * Find a specific value with key into response header
   * @param setCookies the set-cookies array of the header
   * @param key the key of the set-cookie to return
   */
  private findSetCookieValue(setCookies: string[], key: string) {
    const setCookie = setCookies.find((setCookie) =>
      setCookie
      .toLocaleLowerCase()
      .includes(
        key.toLocaleLowerCase()
      )
    );
    return this.extractCookieValues(setCookie);
  }

  /**
   * Extract informations of a cookie
   * @param cookie the cookie to extracts infromations
   */
  private extractCookieValues(cookie: string): ICookie {
    const values = cookie.split(";")[0].split("=");
    return {
      key: values[0],
      value: values[1]
    };
  }
}
