import { createFrames } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import { config } from '@/lib/config';

export const frames = createFrames({
  basePath: "/frames",
  middleware: [farcasterHubContext({
    hubHttpUrl: config.host
  })],
  initialState: {
    count: 0
  }
});