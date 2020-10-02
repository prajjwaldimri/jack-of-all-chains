import Block from "../block";
import BlockData from "../block/blockData";
import BlockHeader from "../block/blockHeader";
import Chain from "../chain";
import { GENESIS_BLOCK_DATA } from "../util/config";
import hasher from "../util/hasher";
import Consensus from "./consensus";

class ProofOfWork implements Consensus {
  getGenesisBlock(): Block {
    const genesisBlockHeader = new BlockHeader(
      GENESIS_BLOCK_DATA.prevBlockHash,
      GENESIS_BLOCK_DATA.difficulty,
      GENESIS_BLOCK_DATA.timestamp,
      GENESIS_BLOCK_DATA.nonce,
      GENESIS_BLOCK_DATA.extraNonce
    );
    return new Block(
      genesisBlockHeader,
      new BlockData(),
      "*--- GENESIS ---*",
      new ProofOfWork()
    );
  }

  createBlock(blockData: BlockData, prevBlock: Block): Block {
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

    return new Block(
      blockHeader,
      blockData,
      hash,
      new ProofOfWork(),
      timeTakenToMine
    );
  }

  isBlockValid(block: Block, prevBlock: Block): boolean {
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

  isChainValid(chain: Chain) {
    for (let i = 1; i < chain.blocks.length; i++) {
      if (!this.isBlockValid(chain.blocks[i], chain.blocks[i - 1])) {
        return false;
      }
    }

    return true;
  }
}

export default ProofOfWork;
