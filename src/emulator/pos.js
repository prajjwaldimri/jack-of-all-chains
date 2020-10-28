const { spawn } = require("child_process");
const chalk = require("chalk");
const bent = require("bent");
const getJSON = bent("json");

const peer_ports = [10000, 10001, 10002];
const p2p_ports = [5001, 5002, 5003];

/* Startup Logic */
const server = spawn("npm", ["run", "start-server-pos"]);
let peer1, peer2, peer3;

setTimeout(() => {
  peer1 = spawn("npm", ["run", "start-peer-pos"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[0],
      P2P_PORT: p2p_ports[0],
      PEERS: `ws://localhost:5000`,
    },
  });
}, 100);

setTimeout(() => {
  peer2 = spawn("npm", ["run", "start-peer-pos"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[1],
      P2P_PORT: p2p_ports[1],
      PEERS: `ws://localhost:5000,ws://localhost:${p2p_ports[0]}`,
    },
  });
}, 200);

setTimeout(() => {
  peer3 = spawn("npm", ["run", "start-peer-pos"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[2],
      P2P_PORT: p2p_ports[2],
      PEERS: `ws://localhost:5000,ws://localhost:${p2p_ports[0]},ws://localhost:${p2p_ports[1]}`,
    },
  });
}, 300);

/* Node Emulation Logic */

setTimeout(async () => {
  try {
    let post, postPeer1, postPeer2, postPeer3;
    for (let i = 0; i < 50; i++) {
      // Create transactions
      post = bent(`http://localhost:3333/`, "POST", "json", 200);
      postPeer1 = bent(
        `http://localhost:${peer_ports[0]}/`,
        "POST",
        "json",
        200
      );
      postPeer2 = bent(
        `http://localhost:${peer_ports[1]}/`,
        "POST",
        "json",
        200
      );
      postPeer3 = bent(
        `http://localhost:${peer_ports[2]}/`,
        "POST",
        "json",
        200
      );
      await post("api/transact", {
        data: { transactionValue: Math.random() * 50 },
      });
      await postPeer1("api/transact", {
        data: { transactionValue: Math.random() * 50 },
      });
      await postPeer2("api/transact", {
        data: { transactionValue: Math.random() * 50 },
      });
      await postPeer3("api/transact", {
        data: { transactionValue: Math.random() * 50 },
      });
    }

    // Proof of Stake Simulation

    // Add stakes
    await post("api/pos/addStake", {
      data: { stake: Math.random() * 100 },
    });
    await postPeer1("api/pos/addStake", {
      data: { stake: Math.random() * 100 },
    });
    await postPeer2("api/pos/addStake", {
      data: { stake: Math.random() * 100 },
    });
    await postPeer3("api/pos/addStake", {
      data: { stake: Math.random() * 100 },
    });

    let transactionPool = await getJSON(
      `http://localhost:3333/api/transaction-pool`
    );
    setInterval(async () => {
      try {
        transactionPool = await getJSON(
          `http://localhost:3333/api/transaction-pool`
        );
      } catch (err) {
        console.error(err);
      }
    }, 1000);

    setInterval(async () => {
      try {
        let transaction =
          transactionPool.transactions[
            Object.keys(transactionPool.transactions)[0]
          ];
        await post("api/pos/cacheTransaction", {
          data: transaction,
        });
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    setInterval(async () => {
      try {
        let transaction =
          transactionPool.transactions[
            Object.keys(transactionPool.transactions)[1]
          ];
        await postPeer1("api/pos/cacheTransaction", {
          data: transaction,
        });
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    setInterval(async () => {
      try {
        let transaction =
          transactionPool.transactions[
            Object.keys(transactionPool.transactions)[2]
          ];
        await postPeer2("api/pos/cacheTransaction", {
          data: transaction,
        });
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    setInterval(async () => {
      try {
        let transaction =
          transactionPool.transactions[
            Object.keys(transactionPool.transactions)[3]
          ];
        await postPeer3("api/pos/cacheTransaction", {
          data: transaction,
        });
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  } catch (err) {
    console.log(err);
  }
}, 10000);

/* Cleanup Logic */
setTimeout(() => {
  server.stdout.on("data", (data) => console.log(chalk.red(data.toString())));
  peer1.stdout.on("data", (data) => console.log(chalk.blue(data.toString())));
  peer2.stdout.on("data", (data) => console.log(chalk.green(data.toString())));
  peer3.stdout.on("data", (data) => console.log(chalk.yellow(data.toString())));

  server.on("error", () => {
    peer1.kill();
    peer2.kill();
    peer3.kill();
  });

  peer1.on("error", () => {
    server.kill();
    peer2.kill();
    peer3.kill();
  });

  peer2.on("error", () => {
    server.kill();
    peer1.kill();
    peer3.kill();
  });

  peer3.on("error", () => {
    server.kill();
    peer1.kill();
    peer2.kill();
  });

  server.on("close", () => {
    console.log(chalk.red("Server closing"));
    peer1.kill();
    peer2.kill();
    peer3.kill();
  });

  peer1.on("close", () => {
    console.log(chalk.blue("Peer1 closing"));
    server.kill();
    peer2.kill();
    peer3.kill();
  });

  peer2.on("close", () => {
    console.log(chalk.green("Peer2 closing"));
    server.kill();
    peer1.kill();
    peer3.kill();
  });

  peer3.on("close", () => {
    console.log(chalk.yellow("Peer2 closing"));
    server.kill();
    peer1.kill();
    peer2.kill();
  });
}, 500);
