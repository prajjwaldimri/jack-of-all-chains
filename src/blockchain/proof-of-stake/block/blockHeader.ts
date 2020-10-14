import { VERSION } from "../../util/config";

class BlockHeader {
  public version: string;
  public prevBlockHash: string;
  public timestamp: number;
  public dataHash: string;

  constructor(prevBlockHash: string, timestamp?: number, dataHash?: string) {
    this.version = VERSION;
    this.prevBlockHash = prevBlockHash;
    this.timestamp = timestamp || Date.now();
    this.dataHash = dataHash || "";
  }
}

export default BlockHeader;
