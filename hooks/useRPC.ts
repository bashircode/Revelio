import { getTransactions } from "@/actions/getTransactions"
import { sendSolana } from "@/actions/sendSol"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useRPC = () => {
    return useQuery({
        queryKey: ["rpc"],
        queryFn: async () => {
            return {
                sendSolana: async ({ amount, toAddress }: { amount: string; toAddress: string }) =>
                    await sendSolana(amount, toAddress),
            }
        }
    })
}

export const useSendSolana = () => {
    return useMutation({
        mutationFn: async ({ amount, toAddress }: { amount: string; toAddress: string }) =>
            await sendSolana(amount, toAddress),
    })
}
    

export const useTransactions = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            return {
                getTransactions: async ({ address }: { address: string }) =>
                    await getTransactions(address),
            }
        }
    })
}    