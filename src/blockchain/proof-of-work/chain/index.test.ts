import { GENESIS_BLOCK_DATA_POW } from "../../util/config";
import POW_Chain from ".";
import POW_Block from "../block";
import BlockData from "../block/blockData";
import BlockHeader from "../block/blockHeader";

describe("Chain tests", () => {
  let chain: POW_Chain;

  beforeEach(() => {
    chain = new POW_Chain();
  });

  it("should create a genesis block for each new chain", () => {
    expect(chain.blocks[0].blockHeader.nonce).toEqual(
      GENESIS_BLOCK_DATA_POW.nonce
    );
    expect(chain.blocks[0].blockHeader.prevBlockHash).toEqual(
      GENESIS_BLOCK_DATA_POW.prevBlockHash
    );
    expect(chain.blocks[0].blockHeader.timestamp).toEqual(
      GENESIS_BLOCK_DATA_POW.timestamp
    );
    expect(chain.blocks[0].blockHeader.difficulty).toEqual(
      GENESIS_BLOCK_DATA_POW.difficulty
    );
  });

  describe("addBlock()", () => {
    let block: POW_Block;

    beforeEach(() => {
      chain = new POW_Chain();
    });

    it("should add two correct blocks", () => {
      block = POW_Block.createBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.addBlock(block);

      block = POW_Block.createBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.addBlock(block);

      expect(chain.blocks.length).toBe(3);
    });

    it("should not add an incorrect block", () => {
      block = new POW_Block(
        new BlockHeader(
          GENESIS_BLOCK_DATA_POW.prevBlockHash,
          GENESIS_BLOCK_DATA_POW.difficulty + 1
        ),
        new BlockData(),
        "*-- Test --*"
      );
      chain.addBlock(block);
      expect(chain.blocks.length).toBe(1);
    });
  });

  describe("isChainValid()", () => {
    let block: POW_Block;

    beforeEach(() => {
      chain = new POW_Chain();
    });

    it("should return true for valid chain", () => {
      block = POW_Block.createBlock(
        new BlockData(),
        chain.blocks[chain.blocks.length - 1]
      );
      chain.blocks = [POW_Block.getGenesisBlock(), block];

      expect(POW_Chain.isChainValid(chain)).toBe(true);
    });

    it("should return false for invalid chain", () => {
      block = new POW_Block(
        new BlockHeader(
          GENESIS_BLOCK_DATA_POW.prevBlockHash,
          GENESIS_BLOCK_DATA_POW.difficulty + 1
        ),
        new BlockData(),
        "*-- Test --*"
      );
      chain.blocks = [POW_Block.getGenesisBlock(), block];

      expect(POW_Chain.isChainValid(chain)).toBe(false);
    });
  });
});
