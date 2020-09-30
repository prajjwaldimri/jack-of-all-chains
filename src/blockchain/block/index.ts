import BlockData from "./blockData";
import BlockHeader from "./blockHeader";
import { GENESIS_BLOCK_DATA } from "../util/config";
import hasher from "../util/hasher";

class Block {
  public blockData: BlockData;
  public blockHeader: BlockHeader;
  public blockHash: string;
  public timeTakenToMine: number;

  constructor(
    blockHeader: BlockHeader,
    blockData: BlockData,
    blockHash: string,
    timeTakenToMine?: number
  ) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
    this.blockHash = blockHash;
    this.timeTakenToMine = timeTakenToMine || 1000;
  }

  static getGenesisBlock() {
    const genesisBlockHeader = new BlockHeader(
      GENESIS_BLOCK_DATA.prevBlockHash,
      GENESIS_BLOCK_DATA.difficulty,
      GENESIS_BLOCK_DATA.timestamp,
      GENESIS_BLOCK_DATA.nonce,
      GENESIS_BLOCK_DATA.extraNonce
    );
    return new Block(genesisBlockHeader, new BlockData(), "*--- GENESIS ---*");
  }

  static isBlockValid(block: Block, prevBlock: Block) {
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

    return true;
  }

  static mineBlock(blockData: BlockData, prevBlock: Block) {
    let hash = "";
    let difficulty =
      prevBlock.timeTakenToMine < 1000
        ? prevBlock.blockHeader.difficulty - 1
        : prevBlock.blockHeader.difficulty + 1;

    let blockHeader = new BlockHeader(prevBlock.blockHash, difficulty);

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

    return new Block(blockHeader, blockData, hash, timeTakenToMine);
  }
}

export default Block;
