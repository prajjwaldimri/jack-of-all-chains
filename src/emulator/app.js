const { spawn } = require("child_process");
const chalk = require("chalk");
const bent = require("bent");
const getJSON = bent("json");

const peer_ports = [10000, 10001, 10002];
const p2p_ports = [5001, 5002, 5003];

const server = spawn("npm", ["run", "start-server"]);
let peer1, peer2, peer3;

setTimeout(() => {
  peer1 = spawn("npm", ["run", "start-peer"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[0],
      P2P_PORT: p2p_ports[0],
      PEERS: `ws://localhost:${p2p_ports[0]}`,
    },
  });
}, 100);

setTimeout(() => {
  peer2 = spawn("npm", ["run", "start-peer"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[1],
      P2P_PORT: p2p_ports[1],
      PEERS: `ws://localhost:${p2p_ports[0]},ws://localhost:${p2p_ports[1]}`,
    },
  });
}, 200);

setTimeout(() => {
  peer3 = spawn("npm", ["run", "start-peer"], {
    env: {
      PATH: process.env.PATH,
      PEER_PORT: peer_ports[2],
      P2P_PORT: p2p_ports[2],
      PEERS: `ws://localhost:${p2p_ports[0]},ws://localhost:${p2p_ports[1]},ws://localhost:${p2p_ports[2]}`,
    },
  });
}, 300);

setTimeout(() => {}, 500);

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
