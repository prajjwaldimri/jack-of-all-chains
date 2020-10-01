import PubSub from "pubsub-js";

enum CHANNELS {
  "SYNC",
  "BLOCKCHAIN",
}

class Pubsub {
  constructor() {
    this.subscribeToChannels();
  }

  subscribeToChannels() {
    for (const channel in CHANNELS) {
      PubSub.subscribe(channel, (channel: string, data: string) =>
        this.messageHandler(channel, data)
      );
    }
  }

  messageHandler(channel: string, data: string) {
    console.log(channel, data);
    switch (channel) {
      case CHANNELS.SYNC.toString():
        break;

      case CHANNELS.BLOCKCHAIN.toString():
        break;

      default:
        break;
    }
  }

  publish(channel: string, data: string) {
    PubSub.publish(channel, data);
  }
}

export default Pubsub;
