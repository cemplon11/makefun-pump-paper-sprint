// Paper Sprint bot entrypoint: flow-confirmed momentum on the pump.fun replay.
// The grader runs `node main.ts` (Node 22); the wire protocol lives in the
// vendored SDK shim and the trading logic in strategy.ts.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, PARAMS } from './strategy.ts';

await runBot(createStrategy(PARAMS));
