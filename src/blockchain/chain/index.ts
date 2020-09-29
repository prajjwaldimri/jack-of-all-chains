import Block from "../block";
import hasher from "../util/hasher";

class Chain {
  public blocks: Block[];

  constructor() {
    this.blocks = [Block.getGenesisBlock()];
  }

  addBlock(block: Block) {
    if (!this.isBlockValid(block)) {
      return;
    }
    this.blocks.push(block);
  }

  isBlockValid(block: Block) {
    // Check if the difficulty in the incoming block is only increased/decreased by 1
    const prevBlock = this.blocks[this.blocks.length - 1];

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
}

export default Chain;
