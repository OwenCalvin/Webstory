import { Service, Inject } from "rakkit";
import { UserModel } from "../models";
import { InstagramService } from "./InstagramService";
import { UserService } from "./UserService";
import { IStoryResponse, StoryResponse } from "../types";
import { Subject } from "rxjs";
import { chunk as Chunk } from "lodash";

@Service()
export class StoryService {
  @Inject()
  private _instagramService: InstagramService;

  @Inject()
  private _userService: UserService;

  private _storyQueryHash: string = "de8017ee0a7c9c45ec4260733d81ea31";
  private _updateInterval = this.getTimeInMinutes(5);

  constructor() {
    this.launchUpdate();
  }

  /**
   * Fetch the story of the user and returns all informations
   * @param userId The instagram id of the user
   */
  async fetch(users: UserModel[]): Promise<StoryResponse.ReelsMedia[]> {
    if (users.length > 0) {
      const storyResponse: IStoryResponse = (await this._instagramService.makeRequest(
        this._instagramService.getInstagramQueryUrl(
          this._storyQueryHash, {
            reel_ids: users.map((user) => user.UserId),
            precomposed_overlay: false
          }
        )
      )).data;
      return storyResponse.data.reels_media;
    }
    return [];
  }

  /**
   * Fetch the story each X minutes and sends it to the socket
   */
  async launchUpdate() {
    setTimeout(async () => {
      const premiumChunks = Chunk(this._userService.PremiumValues, 20);
      for (const chunk of premiumChunks) {
        const stories = await this.fetch(
          chunk.filter((user) =>
            user.Socket
          )
        );
        stories.map((story) => {
          const user = this._userService.Premiums.get(story.user.id);
          if (user && user.Socket) {
            user.Socket.emit("story", story);
          }
        });
        await this.coolDown(
          4 + Math.floor(Math.random() * 4)
        );
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
