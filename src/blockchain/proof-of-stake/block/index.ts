import BlockData from "./blockData";
import BlockHeader from "./blockHeader";

class POS_BLOCK {
  public blockData: BlockData;
  public blockHeader: BlockHeader;
  public blockHash: string;

  constructor(
    blockHeader: BlockHeader,
    blockData: BlockData,
    blockHash: string
  ) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
    this.blockHash = blockHash;
  }

  static isBlockValid(block: POS_BLOCK, prevBlock: POS_BLOCK): boolean {}

  static getGenesisBlock(): POS_BLOCK {}

  static createBlock(): POS_BLOCK {}
}

export default POS_BLOCK;
