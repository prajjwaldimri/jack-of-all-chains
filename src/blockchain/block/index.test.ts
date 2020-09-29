import Block from ".";
import BlockData from "./blockData";

describe("Block Tests", () => {
  let firstBlock: Block;

  beforeEach(() => {
    firstBlock = Block.getGenesisBlock();
  });

  describe("mineBlock()", () => {
    it("should mine a block properly", () => {
      let block = Block.mineBlock(new BlockData(), firstBlock);

      expect(
        block.blockHash.substring(0, block.blockHeader.difficulty)
      ).toEqual("0".repeat(block.blockHeader.difficulty));

      expect(block.blockHeader.prevBlockHash).toEqual(firstBlock.blockHash);
    });
  });
});
