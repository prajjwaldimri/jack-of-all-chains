import BlockData from "./blockData";
import BlockHeader from "./blockHeader";
import Consensus from "../consensus/consensus";

class Block {
  public consensus: Consensus;
  public blockData: BlockData;
  public blockHeader: BlockHeader;
  public blockHash: string;
  public timeTakenToMine: number;

  constructor(
    blockHeader: BlockHeader,
    blockData: BlockData,
    blockHash: string,
    consensus: Consensus,
    timeTakenToMine?: number
  ) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
    this.blockHash = blockHash;
    this.consensus = consensus;
    this.timeTakenToMine = timeTakenToMine || 1000;
  }
}

export default Block;
