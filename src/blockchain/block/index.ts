import BlockData from "./blockData";
import BlockHeader from "./blockHeader";
import { GENESIS_BLOCK_DATA } from "../util/config";

class Block {
  public blockData: BlockData;
  public blockHeader: BlockHeader;

  constructor(blockHeader: BlockHeader, blockData: BlockData) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
  }

  static getGenesisBlock() {
    const genesisBlockHeader = new BlockHeader(
      GENESIS_BLOCK_DATA.prevBlockHash,
      GENESIS_BLOCK_DATA.difficulty,
      GENESIS_BLOCK_DATA.timestamp,
      GENESIS_BLOCK_DATA.nonce,
      GENESIS_BLOCK_DATA.extraNonce
    );
    return new Block(genesisBlockHeader, new BlockData());
  }
}

export default Block;
