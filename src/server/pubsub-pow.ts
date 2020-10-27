import WebSocket, { Server } from "ws";
import POW_Chain from "../blockchain/proof-of-work/chain";
import Transaction from "../blockchain/wallet/transaction";
import TransactionPool from "../blockchain/wallet/transactionPool";

const CHANNELS = {
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

interface Message {
  type: String;
  transaction?: Transaction;
  chain?: POW_Chain;
}

const P2P_PORT = process.env.P2P_PORT
  ? Number.parseInt(process.env.P2P_PORT)
  : 5000;

const peers = process.env.PEERS ? process.env.PEERS?.split(",") : [];

class PubsubPOW {
  public server: Server;
  public sockets: WebSocket[];

  constructor(
    public transactionPool: TransactionPool,
    public chain: POW_Chain
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
        this.chain.replaceChain(parsedMessage.chain as POW_Chain);
        this.transactionPool.clearBlockchainTransactions(
          parsedMessage.chain as POW_Chain
        );
        break;

      case CHANNELS.TRANSACTION:
        this.transactionPool.addTransaction(
          parsedMessage.transaction as Transaction
        );
        break;

      default:
        break;
    }
  }

  broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach((socket) => this.sendTransaction(transaction, socket));
  }

  sendTransaction(transaction: Transaction, socket: WebSocket) {
    const message: Message = {
      type: CHANNELS.TRANSACTION,
      transaction: transaction,
    };

    socket.send(JSON.stringify(message));
  }

  sendChain(chain: POW_Chain, socket: WebSocket) {
    const message: Message = {
      type: CHANNELS.BLOCKCHAIN,
      chain: chain,
    };

    socket.send(JSON.stringify(message));
  }

  broadcastChain() {
    this.sockets.forEach((socket) => this.sendChain(this.chain, socket));
  }
}

export default PubsubPOW;
