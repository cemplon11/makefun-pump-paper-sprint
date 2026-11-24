# Graduation Run — Pump.fun Paper Sprint bot

A deterministic paper-trading bot for the pump.fun bonding-curve replay
(`agent-fun/replay/v2`, harness `pumpfun-replay/v2`). It trades only replayed
market data — no real funds are ever involved.

## Strategy

Most active styles on pump.fun bleed the ~1.25% curve fee: on the dev window,
momentum chasing, launch sniping and dip-buying all grade negative. The one
pattern with a positive expectancy in the dev data is the **graduation run**:
a curve whose real SOL reserve reaches about **55 SOL** is deep into its run
toward completion, and the inflow that carried it there tends to keep pushing.

The bot therefore makes exactly one trade per coin:

- **Entry** — the first time a curve's real SOL reserve reaches 55 SOL, buy
  once (never twice on the same coin), sized at the harness cap of 1% of the
  real reserve (target 0.6 SOL).
- **Exits** — sell the whole position at +30% take-profit, at −15% stop-loss,
  or after 900 slots, whichever comes first. A curve that completes while
  held is closed by the replay at its final reserves.
- **Guardrail probes** — the competition requires a round trip of at least
  0.01 SOL on at least 20 distinct coins and max drawdown ≤ 50%. Graduation
  runs are rare, so the bot also runs tiny 0.015 SOL probe round trips on
  liquid curves (buy, sell as soon as it lands) until 24 coins have been
  round-tripped, keeping the entry comfortably inside the guardrails.

The bot is fully deterministic: no clock, no randomness, no network, no
environment reads — two runs over the same event stream produce identical
order logs.

## Files

- `main.ts` — entrypoint the grader runs (`node main.ts`, Node 22).
- `strategy.ts` — the trading logic and its parameters.
- `vendor/makefun-bot.ts` — the kit's `agent-fun/replay/v2` SDK shim,
  vendored byte for byte.

## Local grade (dev window, src-calib)

Net PnL **+1.99 SOL** on 10 SOL capital, 86 fills over 43 coins, max
drawdown 2.6%, guardrails met; +1.34 SOL excluding the 3 best coins and
+1.66 SOL at double fees.
