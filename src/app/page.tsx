import { assets, config } from '@/lib/config';
import { Frame, getFrameFlattened } from "frames.js";
import Link from 'next/link';

const initialFrame: Frame = {
  image: assets.nft,
  version: "vNext",
  buttons: [
    {
      label: "Mint NFT",
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
  return <main>
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='text-center flex gap-y-2 flex-col'>
        <h1 className='text-4xl font-bold'>Bounty Frames</h1>
        <p>
          This is sample example to mint NFT using Frames in farcaster.
        </p>
        <div>
          <div>
            Copy url and paste in farcaster to mint NFT
          </div>
          <div className='font-bold text-blue-400'>
            {config.host}
          </div>
        </div>
        <div>
          Build by <Link
            className='text-blue-400 font-bold'
            href={"https://warpcast.com/dharmikjagodana"}>
            @dharmikjagodana
          </Link>
        </div>
      </div>
    </div>
  </main>
}