import Block from "../block";
import Consensus from "../consensus/consensus";

class Chain {
  public blocks: Block[];

  constructor(public consensus: Consensus) {
    this.blocks = [consensus.getGenesisBlock()];
  }

  addBlock(block: Block) {
    if (
      !this.consensus.isBlockValid(block, this.blocks[this.blocks.length - 1])
    ) {
      return;
    }
    this.blocks.push(block);
  }

  replaceChain(chain: Chain) {
    if (
      this.consensus.isChainValid(chain) &&
      chain.blocks.length > this.blocks.length
    ) {
      this.blocks = chain.blocks;
    }
  }
}

export default Chain;
