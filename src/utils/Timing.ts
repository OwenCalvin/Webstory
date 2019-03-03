export class Timing {
  /**
  * Prevent the InstaAPI ban for spamming
  * @param delay The delay to wait in seconds
  */
  static async waitFor(delay: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, this.getTimeInSecond(delay));
    });
  }

  static getTimeInMinutes(minutes: number) {
    return this.getTimeInSecond(60 * minutes);
  }

  static getTimeInSecond(second: number) {
    return 1000 * second;
  }
}
