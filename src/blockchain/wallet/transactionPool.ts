import Transaction from "./transaction";

class TransactionPool {
  public transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction: Transaction) {
    if (Transaction.isTransactionValid(transaction)) {
      this.transactions.push(transaction);
    }
  }
}

export default TransactionPool;
