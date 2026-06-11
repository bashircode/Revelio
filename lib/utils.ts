import { LAMPORTS_PER_SOL, ParsedTransactionWithMeta } from "@solana/web3.js"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ClassifiedTransaction {
  type: "buy" | "sell" | "SOL_TRANSFER" | "TOKEN_TRANSFER"
  amountSol: number
  tokenAmount: number
  fee: number
  timestamp: number | null
  tokenMint: string | null
}

// Derive the token amount change for the signer from pre/post token balances
type TokenBalances = NonNullable<NonNullable<ParsedTransactionWithMeta["meta"]>["preTokenBalances"]>

function getTokenAmountChange(
  preBalances: TokenBalances,
  postBalances: TokenBalances,
  mint: string | null
): number {
  if (!mint) return 0

  // Find the matching pre/post entries for this mint
  const pre = preBalances.find((b) => b.mint === mint)
  const post = postBalances.find((b) => b.mint === mint)

  const preAmount = pre?.uiTokenAmount?.uiAmount ?? 0
  const postAmount = post?.uiTokenAmount?.uiAmount ?? 0

  return Math.abs(postAmount - preAmount)
}

export const classifyTransaction = (tx: ParsedTransactionWithMeta): ClassifiedTransaction => {
  const fee = (tx.meta?.fee ?? 0) / LAMPORTS_PER_SOL
  const timestamp = tx.blockTime ?? null

  if (!tx?.meta) return { type: "SOL_TRANSFER", amountSol: 0, tokenAmount: 0, fee, timestamp, tokenMint: null }

  const tokenPreBalance = tx.meta.preTokenBalances || []
  const tokenPostBalance = tx.meta.postTokenBalances || []

  // Pick the primary token mint from whichever balance list has entries
  const primaryMint =
    tokenPostBalance[0]?.mint ??
    tokenPreBalance[0]?.mint ??
    null

  const solChangeForSigner =
    (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / LAMPORTS_PER_SOL

  const tokenAmount = getTokenAmountChange(tokenPreBalance, tokenPostBalance, primaryMint)

  // No token balances involved → plain SOL transfer
  if (tokenPreBalance.length === 0 && tokenPostBalance.length === 0) {
    return {
      type: "SOL_TRANSFER",
      amountSol: Math.abs(solChangeForSigner),
      tokenAmount: 0,
      fee,
      timestamp,
      tokenMint: null,
    }
  }

  // SOL spent + gained a token → buy
  if (solChangeForSigner < 0 && tokenPostBalance.length > 0) {
    return {
      type: "buy",
      amountSol: Math.abs(solChangeForSigner),
      tokenAmount,
      fee,
      timestamp,
      tokenMint: primaryMint,
    }
  }

  // SOL received + lost a token → sell
  if (solChangeForSigner > 0 && tokenPreBalance.length > 0) {
    return {
      type: "sell",
      amountSol: solChangeForSigner,
      tokenAmount,
      fee,
      timestamp,
      tokenMint: primaryMint,
    }
  }

  return {
    type: "TOKEN_TRANSFER",
    amountSol: Math.abs(solChangeForSigner),
    tokenAmount,
    fee,
    timestamp,
    tokenMint: primaryMint,
  }
}