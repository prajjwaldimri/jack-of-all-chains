import { SHA3 } from "sha3";

function hasher(data: object): string {
  const hash = new SHA3(256);

  hash.update(JSON.stringify(data));

  return hash.digest("hex");
}

export default hasher;
