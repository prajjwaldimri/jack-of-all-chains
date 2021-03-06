import POW_Block from "../proof-of-work/block";
import BlockData from "../proof-of-work/block/blockData";
import BlockHeader from "../proof-of-work/block/blockHeader";
import hasher from "./hasher";

describe("Hasher test", () => {
  it("should return correct hash", () => {
    expect(hasher({ test: "data" })).toEqual(
      "0001011100100110000110000001010101101001000110011110010010110110100010111001100111110110001110111111000111111011010101110110111100011011001101000001100111101101011101101110000011111001010110111011100101111100100111000011000010001010000111000110110101000110"
    );
  });

  it("produces a new hash even after properties have changed on the input", () => {
    const block1 = new POW_Block(
      new BlockHeader("test", 1),
      new BlockData(),
      "*&*(&*(&"
    );

    const block1Hash = hasher(block1);

    block1.blockHeader.difficulty = 4;

    expect(hasher(block1)).not.toEqual(block1Hash);
  });
});
