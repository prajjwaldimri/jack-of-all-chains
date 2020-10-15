import BlockData from "./blockData";
import BlockHeader from "./blockHeader";
import { GENESIS_BLOCK_DATA_POW } from "../../util/config";
import hasher from "../../util/hasher";

class POW_Block {
  public blockData: BlockData;
  public blockHeader: BlockHeader;
  public blockHash: string;
  public blockNumber: number;
  public timeTakenToMine: number;

  constructor(
    blockHeader: BlockHeader,
    blockData: BlockData,
    blockHash: string,
    blockNumber?: number,
    timeTakenToMine?: number
  ) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
    this.blockHash = blockHash;
    this.blockNumber = blockNumber || 0;
    this.timeTakenToMine = timeTakenToMine || 1000;
  }

  static isBlockValid(block: POW_Block, prevBlock: POW_Block): boolean {
    // Check if the difficulty in the incoming block is only increased/decreased by 1
    if (
      Math.abs(
        prevBlock.blockHeader.difficulty - block.blockHeader.difficulty
      ) > 1
    ) {
      return false;
    }

    // Check if the hash follows the difficulty setting
    if (
      block.blockHash.substring(0, block.blockHeader.difficulty) !==
      "0".repeat(block.blockHeader.difficulty)
    ) {
      return false;
    }

    // Check if the hash of the incoming block is correct
    if (hasher(block.blockHeader) !== block.blockHash) {
      return false;
    }

    // Check if the hash of blockData is correct
    if (hasher(block.blockData) !== block.blockHeader.dataHash) {
      return false;
    }

    return true;
  }

  static getGenesisBlock(): POW_Block {
    const genesisBlockHeader = new BlockHeader(
      GENESIS_BLOCK_DATA_POW.prevBlockHash,
      GENESIS_BLOCK_DATA_POW.difficulty,
      GENESIS_BLOCK_DATA_POW.timestamp,
      GENESIS_BLOCK_DATA_POW.nonce,
      GENESIS_BLOCK_DATA_POW.extraNonce
    );
    return new POW_Block(
      genesisBlockHeader,
      new BlockData(),
      "*--- GENESIS ---*"
    );
  }

  static createBlock(blockData: BlockData, prevBlock: POW_Block): POW_Block {
    let hash = "";
    let difficulty =
      prevBlock.timeTakenToMine < 1000
        ? prevBlock.blockHeader.difficulty - 1
        : prevBlock.blockHeader.difficulty + 1;

    let blockHeader = new BlockHeader(prevBlock.blockHash, difficulty);
    blockHeader.dataHash = hasher(blockData);

    let time = process.hrtime();

    do {
      if (blockHeader.nonce >= Number.MAX_SAFE_INTEGER) {
        blockHeader.extraNonce++;
      } else {
        blockHeader.nonce++;
      }

      blockHeader.timestamp = Date.now();
      hash = hasher(blockHeader);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    time = process.hrtime(time);

    let timeTakenToMine = Math.ceil(time[1] / 1000000);

    return new POW_Block(blockHeader, blockData, hash, timeTakenToMine);
  }
}

export default POW_Block;
