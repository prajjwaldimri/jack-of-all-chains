const { spawn } = require("child_process");
const chalk = require("chalk");
const bent = require("bent");
const getJSON = bent("json");

const peer_ports = [10000, 10001, 10002];
const p2p_ports = [5001, 5002, 5003];

/* Startup Logic */
const server = spawn("npm", ["run", "start-server-pow"]);
let peer1, peer2, peer3;

setTimeout(() => {
  peer1 = spawn("npm", ["run", "start-peer-pow"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[0],
      P2P_PORT: p2p_ports[0],
      PEERS: `ws://localhost:5000`,
    },
  });
}, 100);

setTimeout(() => {
  peer2 = spawn("npm", ["run", "start-peer-pow"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[1],
      P2P_PORT: p2p_ports[1],
      PEERS: `ws://localhost:5000,ws://localhost:${p2p_ports[0]}`,
    },
  });
}, 200);

setTimeout(() => {
  peer3 = spawn("npm", ["run", "start-peer-pow"], {
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
        data: { transactionValue: Math.random() * 100 },
      });
      await postPeer1("api/transact", {
        data: { transactionValue: Math.random() * 100 },
      });
      await postPeer2("api/transact", {
        data: { transactionValue: Math.random() * 100 },
      });
      await postPeer3("api/transact", {
        data: { transactionValue: Math.random() * 100 },
      });
    }

    // Proof of Work Simulation
    const transactionPool = await getJSON(
      `http://localhost:3333/api/transaction-pool`
    );

    let i = 0,
      j = 51,
      k = 101,
      l = 151;

    while (i < 5) {
      const block = await mineBlock(post, [
        transactionPool.transactions[
          Object.keys(transactionPool.transactions)[i]
        ],
      ]);
      await post("api/pow/addBlock", { data: block });
      i++;
    }

    while (j < 60) {
      const block = await mineBlock(postPeer1, [
        transactionPool.transactions[
          Object.keys(transactionPool.transactions)[j]
        ],
      ]);
      await postPeer1("api/pow/addBlock", { data: block });
      j++;
    }

    while (k < 115) {
      const block = await mineBlock(postPeer2, [
        transactionPool.transactions[
          Object.keys(transactionPool.transactions)[k]
        ],
      ]);
      await postPeer2("api/pow/addBlock", { data: block });
      k++;
    }

    while (l < 167) {
      const block = await mineBlock(postPeer3, [
        transactionPool.transactions[
          Object.keys(transactionPool.transactions)[l]
        ],
      ]);
      await postPeer3("api/pow/addBlock", { data: block });
      l++;
    }
  } catch (err) {
    console.log(err);
  }
}, 3000);

const mineBlock = (postPeer, transactions) => {
  return new Promise(async (resolve, reject) => {
    resolve(
      await postPeer("api/pow/mineBlock", {
        data: transactions,
      })
    );
  });
};

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
