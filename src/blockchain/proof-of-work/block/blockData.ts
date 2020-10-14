import Transaction from "../../wallet/transaction";

class BlockData {
  public transactions: Transaction[] = [];

  constructor(transactions?: Transaction[]) {
    this.transactions = transactions || [];
  }
}

export default BlockData;
