import Wallet from '@/components/wallet';
import { config } from '@/lib/config';
import { Frame, getFrameFlattened } from "frames.js";

const initialFrame: Frame = {
  image: "https://picsum.photos/seed/frames.js/1146/600",
  version: "vNext",
  buttons: [
    {
      label: "Random image",
      action: "post",
    },
  ],
  postUrl: `${config.host}/frames`,
};

export async function generateMetadata() {
  return {
    title: "Bounty Frames",
    other: getFrameFlattened(initialFrame),
  };
}

export default function Page() {
  return <span>
    <Wallet />
  </span>;
}