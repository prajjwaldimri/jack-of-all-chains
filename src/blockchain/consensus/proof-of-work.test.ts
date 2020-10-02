import Block from "../block";
import BlockData from "../block/blockData";
import BlockHeader from "../block/blockHeader";
import hasher from "../util/hasher";
import Consensus from "./consensus";
import ProofOfWork from "./proof-of-work";

describe("Proof of work tests", () => {
  let firstBlock: Block;
  let consensus: Consensus;

  beforeEach(() => {
    consensus = new ProofOfWork();
    firstBlock = consensus.getGenesisBlock();
  });

  describe("mineBlock()", () => {
    it("should mine a block properly", () => {
      let block = consensus.createBlock(new BlockData(), firstBlock);

      expect(
        block.blockHash.substring(0, block.blockHeader.difficulty)
      ).toEqual("0".repeat(block.blockHeader.difficulty));

      expect(block.blockHeader.prevBlockHash).toEqual(firstBlock.blockHash);
    });
  });

  describe("isBlockValid()", () => {
    let newBlock: Block;

    beforeEach(() => {
      newBlock = consensus.createBlock(new BlockData(), firstBlock);
    });

    it("should return true for a valid block", () => {
      expect(consensus.isBlockValid(newBlock, firstBlock)).toBe(true);
    });

    it("should return false if the difficulty has been jumped", () => {
      newBlock.blockHeader.difficulty = 10;

      expect(consensus.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is wrong", () => {
      newBlock.blockHash = "*Any wrong hash*";

      expect(consensus.isBlockValid(newBlock, firstBlock)).toBe(false);
    });

    it("should return false if the hash is valid but doesn't comply with the difficulty parameter", () => {
      newBlock.blockHeader.difficulty = 10;
      newBlock.blockHash = hasher(newBlock.blockHeader);

      expect(consensus.isBlockValid(newBlock, firstBlock)).toBe(false);
    });
  });
});
