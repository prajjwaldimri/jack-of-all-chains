import { SHA3 } from "sha3";

function hasher(data: object): string {
  const hash = new SHA3(256);

  hash.update(JSON.stringify(data));

  return hash.digest("hex");
}

function hex2bin(hex: string) {
  var bytes = [],
    str;

  for (var i = 0; i < hex.length - 1; i += 2)
    bytes.push(parseInt(hex.substr(i, 2), 16));

  return String.fromCharCode.apply(String, bytes);
}

export default hasher;
