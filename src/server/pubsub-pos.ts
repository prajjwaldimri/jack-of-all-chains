import WebSocket, { Server } from "ws";
import { Stake } from "../blockchain/proof-of-stake";
import POS_Chain from "../blockchain/proof-of-stake/chain";
import Transaction from "../blockchain/wallet/transaction";
import TransactionPool from "../blockchain/wallet/transactionPool";

const CHANNELS = {
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
  STAKE: "STAKE",
};

interface Message {
  type: String;
  transaction?: Transaction;
  chain?: POS_Chain;
  stake?: number;
  address?: string;
  electedMinerAddress?: string;
}

const P2P_PORT = process.env.P2P_PORT
  ? Number.parseInt(process.env.P2P_PORT)
  : 5000;

const peers = process.env.PEERS ? process.env.PEERS?.split(",") : [];

class PubsubPOS {
  public server: Server;
  public sockets: WebSocket[];

  constructor(
    public transactionPool: TransactionPool,
    public chain: POS_Chain,
    public stake: Stake,
    public minerWithHighestStake: { [key: string]: string }
  ) {
    this.server = new WebSocket.Server({ port: P2P_PORT });
    this.sockets = [];

    this.server.on("connection", (socket) => this.connectSocket(socket));

    this.connectToPeers();
  }

  connectSocket(socket: WebSocket) {
    this.sockets.push(socket);

    socket.on("message", (data) => this.handleMessage(data as string));
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);

      socket.on("open", () => this.connectSocket(socket));
    });
  }

  handleMessage(data: string) {
    let parsedMessage = JSON.parse(data) as Message;

    switch (parsedMessage.type) {
      case CHANNELS.BLOCKCHAIN:
        this.chain.replaceChain(parsedMessage.chain as POS_Chain);
        this.transactionPool.clearBlockchainTransactions(
          parsedMessage.chain as POS_Chain
        );
        break;

      case CHANNELS.TRANSACTION:
        this.transactionPool.addTransaction(
          parsedMessage.transaction as Transaction
        );
        break;

      case CHANNELS.STAKE:
        this.stake.addStake(
          parsedMessage.address as string,
          parsedMessage.stake as number
        );
        this.minerWithHighestStake.address = this.stake.getMaxStakeAddress();
        break;

      default:
        break;
    }
  }

  sendTransaction(transaction: Transaction, socket: WebSocket) {
    const message: Message = {
      type: CHANNELS.TRANSACTION,
      transaction: transaction,
    };

    socket.send(JSON.stringify(message));
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => this.sendTransaction(transaction, socket));
  }

  sendChain(chain: POS_Chain, socket: WebSocket) {
    const message: Message = {
      type: CHANNELS.BLOCKCHAIN,
      chain: chain,
    };

    socket.send(JSON.stringify(message));
  }

  broadcastChain() {
    this.sockets.forEach((socket) => this.sendChain(this.chain, socket));
  }

  sendStake(address: string, stake: number, socket: WebSocket) {
    const message: Message = {
      type: CHANNELS.STAKE,
      stake: stake,
      address: address,
    };

    socket.send(JSON.stringify(message));
  }

  broadcastStake(address: string, stake: number) {
    this.sockets.forEach((socket) => this.sendStake(address, stake, socket));
  }
}

export default PubsubPOS;
