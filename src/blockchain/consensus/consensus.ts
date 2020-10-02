import Block from "../block";
import BlockData from "../block/blockData";
import Chain from "../chain";

interface Consensus {
  createBlock(blockData: BlockData, prevBlock: Block): Block;

  isBlockValid(block: Block, prevBlock: Block): boolean;

  isChainValid(chain: Chain): boolean;

  getGenesisBlock(): Block;
}

export default Consensus;
