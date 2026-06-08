import { clusterApiUrl, Connection } from "@solana/web3.js";

const devnet = clusterApiUrl("devnet");
const mainnet = process.env.MAINNET_URL || "";
// cluster rpc
export const connection = new Connection(mainnet, "confirmed");