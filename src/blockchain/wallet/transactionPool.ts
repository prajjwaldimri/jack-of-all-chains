import POS_Chain from "../proof-of-stake/chain";
import POW_Chain from "../proof-of-work/chain";
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

  clearBlockchainTransactions(chain: POW_Chain | POS_Chain) {
    for (const block of chain.blocks) {
      for (const transaction in block.blockData.transactions) {
        if (this.transactions[transaction]) {
          delete this.transactions[transaction];
        }
      }
    }
  }
}

export default TransactionPool;
