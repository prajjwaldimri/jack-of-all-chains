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

  it("should not return equal hashes in case of objects made with same classes", () => {
    const block1 = new Block(new BlockHeader("test", 1), new BlockData());
    const block2 = new Block(new BlockHeader("test", 2), new BlockData());

    expect(hasher(block1)).not.toEqual(hasher(block2));
  });
});
