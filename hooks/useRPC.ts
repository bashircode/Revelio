import { getTransactions, type TransactionsResponse } from "@/actions/getTransactions"
import { sendSolana } from "@/actions/sendSol"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState, useEffect, useRef, useCallback } from "react"
import type { TokenPnL, WalletStats } from "@/lib/analytics"

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
    

export const useWalletAnalysis = (address: string | null) => {
    return useQuery<TransactionsResponse>({
        queryKey: ["wallet-analysis", address],
        queryFn: async () => {
            if (!address) throw new Error("No address provided")
            return await getTransactions(address)
        },
        enabled: !!address,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    })
}

export interface StreamAnalysisState {
  tokenPnls: TokenPnL[]
  stats: (WalletStats & { transactionCount: number }) | null
  progress: { chunk: number; total: number } | null
  isLoading: boolean
  error: string | null
}

export function useStreamAnalysis(address: string | null): StreamAnalysisState & { reset: () => void } {
  const [state, setState] = useState<StreamAnalysisState>({
    tokenPnls: [],
    stats: null,
    progress: null,
    isLoading: false,
    error: null,
  })

  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ tokenPnls: [], stats: null, progress: null, isLoading: false, error: null })
  }, [])

  useEffect(() => {
    if (!address) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ tokenPnls: [], stats: null, progress: null, isLoading: true, error: null })

    const run = async () => {
      try {
        const response = await fetch(
          `/api/analyze?address=${encodeURIComponent(address)}`,
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split("\n\n")
          buffer = parts.pop() ?? ""

          for (const part of parts) {
            const line = part.trim()
            if (!line.startsWith("data: ")) continue

            let event: any
            try { event = JSON.parse(line.slice("data: ".length)) } catch { continue }

            switch (event.type) {
              case "progress":
                setState((prev) => ({ ...prev, progress: { chunk: event.chunk, total: event.total } }))
                break
              case "token":
                setState((prev) => ({ ...prev, tokenPnls: [...prev.tokenPnls, event.data] }))
                break
              case "stats":
                setState((prev) => ({ ...prev, stats: event.data }))
                break
              case "done":
                setState((prev) => ({ ...prev, isLoading: false }))
                break
              case "error":
                setState((prev) => ({ ...prev, isLoading: false, error: event.message }))
                break
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }))
      }
    }

    run()
    return () => { controller.abort() }
  }, [address])

  return { ...state, reset }
}