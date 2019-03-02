import { Service, Inject } from "rakkit";
import { UserModel } from "../models";
import { InstagramService } from "./InstagramService";
import { UserService } from "./UserService";
import { IStoryResponse, StoryResponse } from "../types";
import { Subject } from "rxjs";

@Service()
export class StoryService {
  @Inject()
  private _instagramService: InstagramService;

  @Inject()
  private _userService: UserService;

  private _storyQueryHash: string = "de8017ee0a7c9c45ec4260733d81ea31";
  private _updateSubject: Subject<StoryResponse.ReelsMedia>;
  private _updateInterval = this.getTimeInMinutes(5);

  /**
   * Event is send when a story informations is fetched
   */
  get UpdateSubject() {
    return this._updateSubject;
  }

  constructor() {
    this._updateSubject = new Subject();
    this.launchUpdate();
  }

  /**
   * Fetch the story of the user and returns all informations
   * @param userId The instagram id of the user
   */
  async fetch(userId: string): Promise<StoryResponse.ReelsMedia> {
    const storyResponse: IStoryResponse = (await this._instagramService.makeRequest(
      this._instagramService.getInstagramQueryUrl(
        this._storyQueryHash, {
          reel_ids: [userId],
          precomposed_overlay: false
        }
      )
    )).data;
    return storyResponse.data.reels_media[0];
  }

  /**
   * Fetch the story each X minutes and sends it to the socket
   */
  async launchUpdate() {
    setTimeout(async () => {
      for (const user of this._userService.PremiumValues) {
        if (user.Socket) {
          const story = await this.fetch(user.UserId);
          if (user.Socket) {
            user.Socket.emit("story", story);
          }
          this._updateSubject.next(story);
          await this.coolDown(
            4 + Math.floor(Math.random() * 4)
          );
        }
      }
      this.launchUpdate();
    }, this._updateInterval);
  }

  /**
   * Prevent the InstaAPI ban for spamming
   * @param delay The delay to wait in seconds
   */
  async coolDown(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, this.getTimeInSecond(delay));
    });
  }

  private getTimeInMinutes(minutes: number) {
    return this.getTimeInSecond(60 * minutes);
  }

  private getTimeInSecond(second: number) {
    return 1000 * second;
  }
}
