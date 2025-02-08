/* /services/TokenReceiver.ts */
import consumerAPI from "../api/ConsumerAPI.ts";

class TokenReceiver {
  static async getTokens(): Promise<string[]> {
    return await consumerAPI.fetchTokens();
  }
}

export default TokenReceiver;