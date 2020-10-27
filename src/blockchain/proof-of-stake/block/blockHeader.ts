import { VERSION } from "../../util/config";

class BlockHeader {
  public version: string;
  public prevBlockHash: string;
  public timestamp: number;
  public dataHash: string;
  public creator: string;

  constructor(
    prevBlockHash: string,
    creator: string,
    timestamp?: number,
    dataHash?: string
  ) {
    this.version = VERSION;
    this.prevBlockHash = prevBlockHash;
    this.creator = creator;
    this.timestamp = timestamp || Date.now();
    this.dataHash = dataHash || "";
  }
}

export default BlockHeader;
