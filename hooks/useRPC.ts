import { sendSolana } from "@/actions/sendSol"
import { mainnet } from "@/lib/rpc-endpoints"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useRPC = () => {
    return useQuery({
        queryKey: ["rpc"],
        queryFn: async () => {
            const res = await fetch(mainnet, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getAccountInfo",
                    params: [
                        "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
                        {
                            "commitment": "finalized",
                            "encoding": "base64"
                        }
                    ],
                }),
            })
            if (!res.ok) {
                throw new Error(`Failed to fetch from Solana RPC: ${res.statusText}`)
            }
            return await res.json()
        }
    })
}

export const useSendSolana = () => {
    return useMutation({
        mutationFn: async ({ amount, toAddress }: { amount: string; toAddress: string }) =>
            await sendSolana(amount, toAddress),
    })
}
    