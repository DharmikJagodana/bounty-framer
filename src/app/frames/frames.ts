import { createFrames } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import { config } from '@/lib/config';

export const frames = createFrames({
  basePath: "/frames",
  baseUrl: new URL(config.host),
  middleware: [farcasterHubContext({
    hubHttpUrl: config.farcasterHub.url
  })],
  initialState: {
    count: 0
  }
});