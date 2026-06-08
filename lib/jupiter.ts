export interface TokenInfo {
  name: string
  symbol: string
  mint: string
  icon?: string
}

const JUP_API_KEY = process.env.JUP_API_KEY

// Generate a readable fallback name from a mint address
export function generateFallbackToken(mint: string): TokenInfo {
  const prefix = mint.slice(0, 4).toUpperCase()
  const suffix = mint.slice(-3).toUpperCase()
  return {
    name: `Unknown (${mint.slice(0, 6)}…${mint.slice(-4)})`,
    symbol: `${prefix}…${suffix}`,
    mint,
  }
}

// Fetch token info from Jupiter for a batch of mints in one call
export async function resolveTokens(mints: string[]): Promise<Map<string, TokenInfo>> {
  "use server"
  
  const map = new Map<string, TokenInfo>()
  if (mints.length === 0) return map

  try {
    const query = mints.join(",")
    const response = await fetch(
      `https://api.jup.ag/tokens/v2/search?query=${query}`,
      {
        headers: {
          "x-api-key": JUP_API_KEY!,
        },
      }
    )
    const tokens: Array<{ id: string; name: string; symbol: string; icon?: string; firstPool?: { id: string } }> =
      await response.json()

    for (const t of tokens) {
      map.set(t.id, {
        name: t.name,
        symbol: t.symbol,
        mint: t.id,
        icon: t.icon,
      })
    }
  } catch (err) {
    console.error("Failed to fetch Jupiter token info:", err)
  }

  return map
}
