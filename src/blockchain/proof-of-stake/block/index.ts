import { GENESIS_BLOCK_DATA_POS } from "../../util/config";
import hasher from "../../util/hasher";
import Wallet from "../../wallet";
import BlockData from "./blockData";
import BlockHeader from "./blockHeader";

class POS_Block {
  public blockData: BlockData;
  public blockHeader: BlockHeader;
  public blockNumber: number;
  public blockHash: string;

  constructor(
    blockHeader: BlockHeader,
    blockData: BlockData,
    blockHash: string,
    blockNumber?: number
  ) {
    this.blockData = blockData;
    this.blockHeader = blockHeader;
    this.blockHash = blockHash;
    this.blockNumber = blockNumber || 0;
  }

  static isBlockValid(block: POS_Block): boolean {
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

  static getGenesisBlock(): POS_Block {
    const genesisBlockHeader = new BlockHeader(
      GENESIS_BLOCK_DATA_POS.prevBlockHash,
      "Universe",
      GENESIS_BLOCK_DATA_POS.timestamp
    );
    return new POS_Block(
      genesisBlockHeader,
      new BlockData(),
      "*--- GENESIS ---*"
    );
  }

  static createBlock(
    blockData: BlockData,
    prevBlock: POS_Block,
    wallet: Wallet
  ): POS_Block {
    let hash = "";

    let blockHeader = new BlockHeader(prevBlock.blockHash, wallet.publicKey);
    blockHeader.dataHash = hasher(blockData);

    blockHeader.timestamp = Date.now();
    hash = hasher(blockHeader);

    return new POS_Block(blockHeader, blockData, hash);
  }
}

export default POS_Block;
