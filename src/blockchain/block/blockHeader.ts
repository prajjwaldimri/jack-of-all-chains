import { VERSION } from "../util/config";

class BlockHeader {
  public version: string;
  public prevBlockHash: string;
  public timestamp: number;
  public nonce: number;
  public extraNonce: number;
  public difficulty: number;

  constructor(
    prevBlockHash: string,
    difficulty: number,
    timestamp?: number,
    nonce?: number,
    extraNonce?: number
  ) {
    this.version = VERSION;
    this.prevBlockHash = prevBlockHash;
    this.timestamp = timestamp || Date.now();
    this.nonce = nonce || 1;
    this.extraNonce = extraNonce || 0;
    this.difficulty = difficulty || 10;
  }
}

export default BlockHeader;
