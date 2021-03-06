import path from "path";
import express from "express";
let app = express();

import bodyParser from "body-parser";
app.use(bodyParser.json());

import cors from "cors";
app.use(cors());

import compression from "compression";
app.use(compression());

const clone = require("rfdc")();

import bent from "bent";
const getJSON = bent("json");

import Wallet from "../blockchain/wallet";
import Pubsub from "./pubsub-pow";
import { POW_Block, POW_Chain } from "../blockchain/proof-of-work";
import TransactionPool from "../blockchain/wallet/transactionPool";
import BlockData from "../blockchain/proof-of-work/block/blockData";

let wallet = new Wallet();
let chain = new POW_Chain();
let transactionPool = new TransactionPool();
let pubsub = new Pubsub(transactionPool, chain);

//#region Front-end
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../client/index-pow.html"));
});

//#endregion

//#region Common chain related endpoints
app.get("/api/chain", (req, res) => {
  res.status(200).json(chain);
});

app.get("/api/chain/getAfter/:after", (req, res) => {
  let tempChain = clone(chain);
  tempChain.blocks = tempChain.blocks.splice(
    Math.abs(Number.parseInt(req.params.after))
  );
  res.status(200).json(tempChain);
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
//#endregion

//#region POW Endpoints
app.post("/api/pow/mineBlock", (req, res) => {
  const { data } = req.body;

  res.json(
    POW_Block.createBlock(
      new BlockData(data),
      chain.blocks[chain.blocks.length - 1]
    )
  );
});

app.post("/api/pow/addBlock", (req, res) => {
  const { data } = req.body;

  chain.addBlock(data);

  pubsub.broadcastChain();

  res.json(chain);
});

//#endregion

const DEFAULT_PORT = 3333;

async function syncWithRoot() {
  let response = await getJSON(`http://localhost:${DEFAULT_PORT}/api/chain`);
  chain.replaceChain(response as POW_Chain);

  response = await getJSON(
    `http://localhost:${DEFAULT_PORT}/api/transaction-pool`
  );
  transactionPool.setTransactions(response as TransactionPool);
}

let PORT = process.env.PEER_PORT || 3333;

app.listen(PORT, () => {
  console.info(`Server started on ${PORT}`);
  if (PORT !== DEFAULT_PORT) syncWithRoot();
});
