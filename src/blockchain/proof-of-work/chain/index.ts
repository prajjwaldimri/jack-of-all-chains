import POW_Block from "../block";

class POW_Chain {
  public blocks: POW_Block[];
  public currentBlockNumber = 1;

  constructor() {
    this.blocks = [POW_Block.getGenesisBlock()];
  }

  addBlock(block: POW_Block) {
    block.blockNumber = this.currentBlockNumber;
    this.currentBlockNumber += 1;
    if (!POW_Block.isBlockValid(block, this.blocks[this.blocks.length - 1])) {
      return;
    }
    this.blocks.push(block);
  }

  replaceChain(chain: POW_Chain) {
    if (
      POW_Chain.isChainValid(chain) &&
      chain.blocks.length > this.blocks.length
    ) {
      this.blocks = chain.blocks;
      this.currentBlockNumber = chain.currentBlockNumber;
    }
  }

  static isChainValid(chain: POW_Chain) {
    for (let i = 1; i < chain.blocks.length; i++) {
      if (!POW_Block.isBlockValid(chain.blocks[i], chain.blocks[i - 1])) {
        return false;
      }
    }

    return true;
  }
}

export default POW_Chain;
