// For ECDSA implementations
import EC from "elliptic";

// Elliptic library tells to only initialize this once and export
let elliptic = new EC.ec("ed25519");

export { elliptic };
