import Chain from "../chain";
import Transaction from "./transaction";

class TransactionPool {
  public transactions: { [key: string]: Transaction };

  constructor() {
    this.transactions = {};
  }

  addTransaction(transaction: Transaction) {
    if (Transaction.isTransactionValid(transaction)) {
      this.transactions[transaction.id] = transaction;
    }
  }

  setTransactions(transactionPool: TransactionPool) {
    this.transactions = transactionPool.transactions;
  }

  clearBlockchainTransactions(chain: Chain) {
    for (const block of chain.blocks) {
      for (const transaction of block.blockData.transactions) {
        if (this.transactions[transaction.id]) {
          delete this.transactions[transaction.id];
        }
      }
    }
  }
}

export default TransactionPool;
