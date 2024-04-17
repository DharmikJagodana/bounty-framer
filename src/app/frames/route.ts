// Route that handles frame actions
import { prisma } from '@/db';
import { assets, config } from '@/lib/config';
import { getFrameHtml, validateFrameMessage, Frame, FrameActionPayload } from "frames.js";
import { NextRequest } from "next/server";
import { farcasterService } from '@/service/farcaster';
import { checkIfAlreadyMinted, mintNft } from '@/web3/mint';


export async function POST(request: NextRequest) {
  const body = (await request.json()) as FrameActionPayload;
  // Parse and validate the frame message
  const { isValid, message } = await validateFrameMessage(body);
  if (!isValid || !message) {
    return new Response("Invalid message", { status: 400 });
  }

  const userFid = body.untrustedData.fid
  const targetFid = body.untrustedData.fid
  const castHash = body.untrustedData.castId.hash

  const promises = []
  promises.push(farcasterService.checkIfFollows(userFid, targetFid))
  promises.push(farcasterService.checkIfRecastedFrame(userFid, targetFid, castHash))
  promises.push(farcasterService.getConnectEthAddress(userFid))

  const [[follows], [recasted], [isConnected, ethAddresses]] = await Promise.all(promises)
  let connectedAddresses = ethAddresses.split(",")
  console.log({
    follows,
    recasted,
    isConnected,
    eth: connectedAddresses
  });

  if (!follows) {
    return mustFollowFrame(userFid, targetFid)
  }

  if (!recasted) {
    return mustRecastFrame(userFid, targetFid)
  }

  if (!isConnected) {
    return mustHaveAccountConnected()
  }

  const isAlreadyMinted = await checkIfAlreadyMinted(connectedAddresses[0])
  if (isAlreadyMinted) {
    return alreadyMinted()
  }

  await mintNft(connectedAddresses[0])

  // logs request body
  const result = await prisma.requestLogs.create({
    data: {
      fid: body.untrustedData.fid,
      url: body.untrustedData.url,
      messageHash: body.untrustedData.messageHash,
      timestamp: body.untrustedData.timestamp,
      network: body.untrustedData.network,
      buttonIndex: body.untrustedData.buttonIndex,
      address: "",
      castId: {
        fid: body.untrustedData.castId.fid,
        hash: body.untrustedData.castId.hash,
      },
      trustedData: {
        messageBytes: body.trustedData.messageBytes,
      }
    }
  })
  console.log("result");
  console.log(result);

  const fid = body.untrustedData.fid;
  const dbUser = await prisma.user.findUnique({
    where: {
      fid: fid
    }
  })
  if (!dbUser) {
    // create user
    await prisma.user.create({
      data: {
        fid: fid,
      }
    })
  }
  return mintedSuccessFrame()
}

function mintedSuccessFrame() {
  const imageUrl = assets.minted;
  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: imageUrl,
    buttons: [
      {
        label: `Visit Website 🚀`,
        action: "link",
        target: config.host
      },
    ],
    ogImage: imageUrl,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}


function alreadyMinted() {
  const imageUrl = assets.error.alreadyMinted;
  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: imageUrl,
    buttons: [
      {
        label: `Visit Website 🚀`,
        action: "link",
        target: config.host
      },
    ],
    ogImage: imageUrl,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}



function mustFollowFrame(fid: number, targetFid: number) {

  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: assets.error.notFollowing,
    buttons: [
      {
        label: `Follow and Refresh`,
        action: "post"
      },
    ],
    ogImage: assets.error.notFollowing,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}

function mustRecastFrame(fid: number, targetFid: number) {
  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: assets.error.notRecasted,
    buttons: [
      {
        label: `Recast and Refresh`,
        action: "post"
      },
    ],
    ogImage: assets.error.notRecasted,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}

function mustHaveAccountConnected() {
  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: assets.error.walletNotConnected,
    buttons: [
      {
        label: `Connect Wallet and Refresh`,
        action: "post"
      },
    ],
    ogImage: assets.error.walletNotConnected,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}
