import { GENESIS_BLOCK_DATA } from "../../util/config";
import Chain from "../chain";

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
});
