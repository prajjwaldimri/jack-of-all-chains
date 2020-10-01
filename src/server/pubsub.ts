import redis, { RedisClient } from "redis";
import Chain from "../blockchain/chain";
import Transaction from "../blockchain/wallet/transaction";
import TransactionPool from "../blockchain/wallet/transactionPool";

const CHANNELS = {
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

class Pubsub {
  private publisher: RedisClient;
  private subscriber: RedisClient;

  constructor(public transactionPool: TransactionPool, public chain: Chain) {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribeToChannels();
    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  handleMessage(channel: string, data: string) {
    let parsedMessage = JSON.parse(data);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.chain.replaceChain(parsedMessage as Chain);
        this.transactionPool.clearBlockchainTransactions(
          parsedMessage as Chain
        );
        break;

      case CHANNELS.TRANSACTION:
        this.transactionPool.addTransaction(parsedMessage as Transaction);
        break;

      default:
        break;
    }
  }

  publish(channel: string, message: string) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction));
  }

  broadcastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.chain));
  }
}

export default Pubsub;
