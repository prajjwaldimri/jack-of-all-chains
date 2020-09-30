import { ec } from "elliptic";
import { elliptic } from "../util/elliptic";

class Transaction {
  public data: object;
  public hash: string;
  public createdBy: string;
  public signature: ec.Signature;

  constructor(
    data: object,
    hash: string,
    walletKey: string,
    signature: ec.Signature
  ) {
    this.data = data;
    this.hash = hash;
    this.createdBy = walletKey;
    this.signature = signature;
  }

  static isTransactionValid(transaction: Transaction): boolean {
    // Check if the signature on the sign matches with the wallet key
    let key = elliptic.keyFromPublic(transaction.createdBy, "hex");

    return key.verify(transaction.hash, transaction.signature);
  }
}

export default Transaction;
