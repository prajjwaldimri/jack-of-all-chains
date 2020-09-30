import Wallet from ".";
import hasher from "../util/hasher";
import Transaction from "./transaction";

describe("Transaction Tests", () => {
  let transaction: Transaction;
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe("isTransactionValid()", () => {
    it("should return true for good transaction", () => {
      let transactionData: object = { data: "Testing Data" };
      let transactionDataHash = hasher(transactionData);

      transaction = new Transaction(
        transactionData,
        transactionDataHash,
        wallet.publicKey,
        wallet.sign(transactionData)
      );

      expect(Transaction.isTransactionValid(transaction)).toBe(true);
    });

    it("should return false for bad transaction", () => {
      let transactionData: object = { data: "Testing Data" };
      let transactionDataHash = hasher({ data: "Fake Data" });

      transaction = new Transaction(
        transactionData,
        transactionDataHash,
        wallet.publicKey,
        wallet.sign(transactionData)
      );

      expect(Transaction.isTransactionValid(transaction)).toBe(false);
    });
  });
});
