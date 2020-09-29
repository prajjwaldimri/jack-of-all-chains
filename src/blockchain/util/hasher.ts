import { SHA3 } from "sha3";
import hexToBinary from "./hexToBinary";

function hasher(data: object): string {
  const hash = new SHA3(256);

  hash.update(JSON.stringify(data));

  return hexToBinary(hash.digest("hex"));
}

export default hasher;
