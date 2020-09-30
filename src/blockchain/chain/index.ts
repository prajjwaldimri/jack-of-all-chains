import Block from "../block";
import hasher from "../util/hasher";

class Chain {
  public blocks: Block[];

  constructor() {
    this.blocks = [Block.getGenesisBlock()];
  }

  addBlock(block: Block) {
    if (!Block.isBlockValid(block, this.blocks[this.blocks.length - 1])) {
      return;
    }
    this.blocks.push(block);
  }

  static isChainValid(chain: Chain) {
    for (let i = 1; i < chain.blocks.length; i++) {
      if (!Block.isBlockValid(chain.blocks[i], chain.blocks[i - 1])) {
        return false;
      }
    }

    return true;
  }
}

export default Chain;
