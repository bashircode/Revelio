"use server"

import { connection } from "@/lib/rpc-endpoints"
import { PublicKey } from "@solana/web3.js"

export const getTransactions = async (address: string) => {
   const pubkey = new PublicKey(address)

   let signatures = await connection.getSignaturesForAddress(
        pubkey,
        {
            limit: 5
        }
    )

    console.log({signatures});

    let transactions = await connection.getParsedTransactions(
        signatures.map(s => s.signature),
        {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        }
    );

    console.group({transactions: transactions.map(t => t?.meta)})

    return signatures
}
