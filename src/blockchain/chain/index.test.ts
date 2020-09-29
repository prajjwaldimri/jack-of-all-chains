import { GENESIS_BLOCK_DATA } from "../util/config";
import Chain from "../chain";
import Block from "../block";
import BlockHeader from "../block/blockHeader";
import BlockData from "../block/blockData";
import hasher from "../util/hasher";

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

  describe("isBlockValid()", () => {
    let newBlock: Block;

    beforeEach(() => {
      newBlock = Block.mineBlock(new BlockData(), chain.blocks[0]);
    });

    it("should return true for a valid block", () => {
      expect(chain.isBlockValid(newBlock)).toBe(true);
    });

    it("should return false if the difficulty has been jumped", () => {
      newBlock.blockHeader.difficulty = 10;

      expect(chain.isBlockValid(newBlock)).toBe(false);
    });

    it("should return false if the hash is wrong", () => {
      newBlock.blockHash = "*Any wrong hash*";

      expect(chain.isBlockValid(newBlock)).toBe(false);
    });

    it("should return false if the hash is valid but doesn't comply with the difficulty parameter", () => {
      newBlock.blockHeader.difficulty = 10;
      newBlock.blockHash = hasher(newBlock.blockHeader);

      expect(chain.isBlockValid(newBlock)).toBe(false);
    });
  });
});
