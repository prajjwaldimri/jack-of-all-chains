import { ec } from "elliptic";
import { elliptic } from "../util/elliptic";
import hasher from "../util/hasher";
import Transaction from "./transaction";

class Wallet {
  public publicKey: string;
  public balance: number;
  private keyPair: ec.KeyPair;

  constructor() {
    this.keyPair = elliptic.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode("hex", true);
    this.balance = 100;
  }

  sign(data: object) {
    return this.keyPair.sign(hasher(data));
  }

  createTransaction(data: object) {
    let transactionHash = hasher(data);
    return new Transaction(
      data,
      transactionHash,
      this.publicKey,
      this.sign(data)
    );
  }

  stake(stakeValue: number) {
    this.balance -= stakeValue;
  }
}

export default Wallet;
