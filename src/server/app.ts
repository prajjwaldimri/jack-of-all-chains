import express from "express";
let app = express();
import bodyParser from "body-parser";
app.use(bodyParser.json());

import bent from "bent";
const getJSON = bent("json");

import Wallet from "../blockchain/wallet";
import Pubsub from "./pubsub";
import Chain from "../blockchain/chain";
import TransactionPool from "../blockchain/wallet/transactionPool";
import ProofOfWork from "../blockchain/consensus/proof-of-work";

let wallet = new Wallet();
let chain = new Chain(new ProofOfWork());
let transactionPool = new TransactionPool();
let pubsub = new Pubsub(transactionPool, chain);

app.get("/api/chain", (req, res) => {
  res.status(200).json(chain);
});

app.get("/api/transaction-pool", (req, res) => {
  res.status(200).json(transactionPool);
});

app.post("/api/transact", (req, res) => {
  const { data } = req.body;

  const transaction = wallet.createTransaction(data);
  transactionPool.addTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.status(200).json(transaction);
});

const DEFAULT_PORT = 3333;

async function syncWithRoot() {
  let response = await getJSON(`http://localhost:${DEFAULT_PORT}/api/chain`);
  chain.replaceChain(response as Chain);

  response = await getJSON(
    `http://localhost:${DEFAULT_PORT}/api/transaction-pool`
  );
  transactionPool.setTransactions(response as TransactionPool);
}

let PORT = 3333;
if (process.env.GENERATE_PEER_PORT === "true") {
  PORT = PORT + Math.ceil(Math.random() * 1000);
}

app.listen(PORT, () => {
  console.info(`Server started on ${PORT}`);
  if (PORT !== DEFAULT_PORT) syncWithRoot();
});
