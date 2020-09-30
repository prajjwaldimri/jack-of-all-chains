import { ec } from "elliptic";
import { elliptic } from "../util/elliptic";
import hasher from "../util/hasher";

class Wallet {
  public publicKey: string;
  private keyPair: ec.KeyPair;

  constructor() {
    this.keyPair = elliptic.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode("hex", false);
  }

  sign(data: object) {
    return this.keyPair.sign(hasher(data));
  }
}

export default Wallet;
