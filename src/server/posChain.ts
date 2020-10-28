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
import Pubsub from "./pubsub-pos";
import { POS_Block, POS_Chain, Stake } from "../blockchain/proof-of-stake";
import TransactionPool from "../blockchain/wallet/transactionPool";
import BlockData from "../blockchain/proof-of-work/block/blockData";

let wallet = new Wallet();
let chain = new POS_Chain();
let stake = new Stake();
let transactionPool = new TransactionPool();
let cachedTransactionPool = new TransactionPool();
let cachedTransactions = 0;

let nextMinerSelectionTime = 0;
let pubsub = new Pubsub(transactionPool, chain, stake);

//#region Front-end
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../client/index-pos.html"));
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

//#region POS Endpoints
app.get("/api/pos/getNextMinerSelectionTime", (req, res) => {
  res.status(200).json({ time: nextMinerSelectionTime });
});

app.post("/api/pos/addStake", (req, res) => {
  const { data } = req.body;

  const stakeValue = Math.round(Number.parseFloat(data.stake));
  if (wallet.balance - stakeValue < 0) {
    res.status(403).send("Stake higher than balance");
  }

  stake.addStake(wallet.publicKey, stakeValue);
  wallet.stake(stakeValue);
  pubsub.broadcastStake(wallet.publicKey, stake.getStake(wallet.publicKey));

  res.status(200).json({ remainingBalance: wallet.balance });
});

app.post("/api/pos/cacheTransaction", (req, res) => {
  const { data } = req.body;

  cachedTransactionPool.addTransaction(data);
  cachedTransactions += 1;

  res.status(200).json(cachedTransactionPool);
});

async function addBlock() {
  try {
    nextMinerSelectionTime = Date.now() + 5000;

    let minerWithHighestStake = stake.getMaxStakeAddress();

    if (stake.getMaxStakeAddress().length < 1) return;

    if (minerWithHighestStake === wallet.publicKey) {
      const data = [];
      for (let i = 0; i < cachedTransactions; i++) {
        if (
          cachedTransactionPool.transactions[
            Object.keys(cachedTransactionPool.transactions)[i]
          ]
        )
          data.push(
            cachedTransactionPool.transactions[
              Object.keys(cachedTransactionPool.transactions)[i]
            ]
          );
      }

      chain.addBlock(
        POS_Block.createBlock(
          new BlockData(data),
          chain.blocks[chain.blocks.length - 1],
          wallet
        )
      );

      pubsub.broadcastChain();
      stake.diluteStake(wallet.publicKey);
      pubsub.broadcastStake(wallet.publicKey, stake.getStake(wallet.publicKey));
      cachedTransactionPool.transactions = {};
      cachedTransactions = 0;
    }
  } catch (err) {
    console.error(err);
  }
}

//#endregion

const DEFAULT_PORT = 3333;

async function syncWithRoot() {
  let response = await getJSON(`http://localhost:${DEFAULT_PORT}/api/chain`);
  chain.replaceChain(response as POS_Chain);

  response = await getJSON(
    `http://localhost:${DEFAULT_PORT}/api/transaction-pool`
  );
  transactionPool.setTransactions(response as TransactionPool);

  response = (await getJSON(
    `http://localhost:${DEFAULT_PORT}/api/pos/getNextMinerSelectionTime`
  )) as getNextMinerResponse;
  nextMinerSelectionTime = response.time;
}

interface getNextMinerResponse {
  time: number;
}

let PORT = process.env.PEER_PORT || 3333;

app.listen(PORT, async () => {
  console.info(`Server started on ${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    await syncWithRoot();
    setTimeout(async () => {
      await addBlock();
      setInterval(async () => {
        await addBlock();
      }, 5000);
    }, nextMinerSelectionTime - Date.now());
  } else {
    nextMinerSelectionTime = Date.now() + 5000;
    setInterval(async () => {
      await addBlock();
    }, 5000);
  }
});
