import Block from "../blockchain/block";
import BlockData from "../blockchain/block/blockData";
import BlockHeader from "../blockchain/block/blockHeader";
import hasher from "./hasher";

describe("Hasher test", () => {
  it("should return correct hash", () => {
    expect(hasher({ test: "data" })).toEqual(
      "172618156919e4b68b99f63bf1fb576f1b3419ed76e0f95bb97c9c308a1c6d46"
    );
  });

  it("produces a new hash even after properties have changed on the input", () => {
    const block1 = new Block(new BlockHeader("test", 1), new BlockData());

    const block1Hash = hasher(block1);

    block1.blockHeader.difficulty = 4;

    expect(hasher(block1)).not.toEqual(block1Hash);
  });
});
