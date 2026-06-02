import { clusterApiUrl, Connection } from "@solana/web3.js";

// cluster rpc
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");