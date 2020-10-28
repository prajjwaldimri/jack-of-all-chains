import POS_Block from "../block";

class POS_Chain {
  public blocks: POS_Block[];

  constructor() {
    this.blocks = [POS_Block.getGenesisBlock()];
  }

  addBlock(block: POS_Block) {
    if (!POS_Block.isBlockValid(block)) {
      console.log("Block is not valid");
      return;
    }
    this.blocks.push(block);
  }

  replaceChain(chain: POS_Chain) {
    if (
      POS_Chain.isChainValid(chain) &&
      chain.blocks.length > this.blocks.length
    ) {
      this.blocks = chain.blocks;
    }
  }

  static isChainValid(chain: POS_Chain) {
    for (let i = 1; i < chain.blocks.length; i++) {
      if (!POS_Block.isBlockValid(chain.blocks[i])) {
        return false;
      }
    }

    return true;
  }
}

export default POS_Chain;
