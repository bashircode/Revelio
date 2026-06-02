'use server'

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "fs";

export const sendSolana = async (amount: string, toAddress: string) => {
    const fromKeypair = Keypair.fromSecretKey(
        Uint8Array.from(
            JSON.parse(
                fs.readFileSync("/Users/peachy/.config/solana/id.json", 'utf-8')
            )
        )
    );

    const toPubkey = toAddress ? new PublicKey(toAddress) : Keypair.generate().publicKey;

    const connection = new Connection("https://api.devnet.solana.com");

    const lamportsToSend = Number(amount) * LAMPORTS_PER_SOL;

    const balance = await connection.getBalance(fromKeypair.publicKey);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey,
            lamports: lamportsToSend,
        }),
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair],
    );

    return signature;
}
