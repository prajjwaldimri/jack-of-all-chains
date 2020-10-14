class Stake {
  public addresses: string[];
  public balance: { [key: string]: number };

  constructor() {
    this.addresses = [];
    this.balance = {};
  }

  initialize(address: string) {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0;
      this.addresses.push(address);
    }
  }

  addStake(address: string, amount: number) {
    this.initialize(address);
    this.balance[address] += amount;
  }

  getStake(address: string) {
    return this.balance[address];
  }

  getMaxStakeAddress() {
    let balance = -1;
    let leader = undefined;
    this.addresses.forEach((address) => {
      if (this.getStake(address) > balance) {
        leader = address;
      }
    });

    return leader;
  }
}

export default Stake;
