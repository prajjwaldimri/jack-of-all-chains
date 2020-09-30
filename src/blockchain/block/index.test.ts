import Block from ".";
import BlockData from "./blockData";
import BlockHeader from "../block/blockHeader";
import hasher from "../util/hasher";

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

  describe("isBlockValid()", () => {
    let newBlock: Block;

    beforeEach(() => {
      newBlock = Block.mineBlock(new BlockData(), firstBlock);
    });

    it("should return true for a valid block", () => {
      expect(Block.isBlockValid(newBlock, firstBlock)).toBe(true);
    });

    it("should return false if the difficulty has been jumped", () => {
      newBlock.blockHeader.difficulty = 10;

      expect(Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is wrong", () => {
      newBlock.blockHash = "*Any wrong hash*";

      expect(Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is valid but doesn't comply with the difficulty parameter", () => {
      newBlock.blockHeader.difficulty = 10;
      newBlock.blockHash = hasher(newBlock.blockHeader);

      expect(Block.isBlockValid(newBlock, firstBlock)).toBe(false);
    });
  });
});
