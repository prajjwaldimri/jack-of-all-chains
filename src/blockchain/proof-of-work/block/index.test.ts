import POW_Block from "../block";
import BlockData from "../block/blockData";
import BlockHeader from "../block/blockHeader";
import hasher from "../../util/hasher";

describe("Proof of work tests", () => {
  let firstBlock: POW_Block;

  beforeEach(() => {
    firstBlock = POW_Block.getGenesisBlock();
  });

  describe("mineBlock()", () => {
    it("should mine a block properly", () => {
      let block = POW_Block.createBlock(new BlockData(), firstBlock);

      expect(
        block.blockHash.substring(0, block.blockHeader.difficulty)
      ).toEqual("0".repeat(block.blockHeader.difficulty));

      expect(block.blockHeader.prevBlockHash).toEqual(firstBlock.blockHash);
    });
  });

  describe("isBlockValid()", () => {
    let newBlock: POW_Block;

    beforeEach(() => {
      newBlock = POW_Block.createBlock(new BlockData(), firstBlock);
    });

    it("should return true for a valid block", () => {
      expect(POW_Block.isBlockValid(newBlock, firstBlock)).toBe(true);
    });

    it("should return false if the difficulty has been jumped", () => {
      newBlock.blockHeader.difficulty = 10;

      expect(POW_Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is wrong", () => {
      newBlock.blockHash = "*Any wrong hash*";

      expect(POW_Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is valid but doesn't comply with the difficulty parameter", () => {
      newBlock.blockHeader.difficulty = 10;
      newBlock.blockHash = hasher(newBlock.blockHeader);

      expect(POW_Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });
  });
});
