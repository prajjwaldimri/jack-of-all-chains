import { GENESIS_BLOCK_DATA } from "../util/config";
import Chain from "../chain";
import Block from "../block";
import BlockData from "../block/blockData";
import BlockHeader from "../block/blockHeader";

describe("Chain tests", () => {
  let chain: Chain;

  beforeEach(() => {
    chain = new Chain();
  });

  it("should create a genesis block for each new chain", () => {
    expect(chain.blocks[0].blockHeader.nonce).toEqual(GENESIS_BLOCK_DATA.nonce);
    expect(chain.blocks[0].blockHeader.prevBlockHash).toEqual(
      GENESIS_BLOCK_DATA.prevBlockHash
    );
    expect(chain.blocks[0].blockHeader.timestamp).toEqual(
      GENESIS_BLOCK_DATA.timestamp
    );
    expect(chain.blocks[0].blockHeader.difficulty).toEqual(
      GENESIS_BLOCK_DATA.difficulty
    );
  });

  describe("addBlock()", () => {
    let block: Block;

    beforeEach(() => {
      chain = new Chain();
    });

    it("should add two correct blocks", () => {
      block = Block.mineBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.addBlock(block);

      block = Block.mineBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.addBlock(block);

      expect(chain.blocks.length).toBe(3);
    });

    it("should not add an incorrect block", () => {
      block = new Block(
        new BlockHeader(
          GENESIS_BLOCK_DATA.prevBlockHash,
          GENESIS_BLOCK_DATA.difficulty + 1
        ),
        new BlockData(),
        "*-- Test --*"
      );
      chain.addBlock(block);
      expect(chain.blocks.length).toBe(1);
    });
  });

  describe("isChainValid()", () => {
    let block: Block;

    beforeEach(() => {
      chain = new Chain();
    });

    it("should return true for valid chain", () => {
      block = Block.mineBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.blocks = [Block.getGenesisBlock(), block];

      expect(Chain.isChainValid(chain)).toBe(true);
    });

    it("should return false for invalid chain", () => {
      block = new Block(
        new BlockHeader(
          GENESIS_BLOCK_DATA.prevBlockHash,
          GENESIS_BLOCK_DATA.difficulty + 1
        ),
        new BlockData(),
        "*-- Test --*"
      );
      chain.blocks = [Block.getGenesisBlock(), block];

      expect(Chain.isChainValid(chain)).toBe(false);
    });
  });
});
