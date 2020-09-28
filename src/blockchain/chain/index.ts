import Block from "../block";

class Chain {
  public blocks: Block[];

  constructor() {
    this.blocks = [Block.getGenesisBlock()];
  }

  addBlock(block: Block) {
    this.blocks.push(block);
  }
}

export default Chain;
