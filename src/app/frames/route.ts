// Route that handles frame actions
import { prisma } from '@/db';
import { assets, config } from '@/lib/config';
import {
  getFrameHtml,
  validateFrameMessage,
  Frame,
  FrameActionPayload,
} from 'frames.js';
import { NextRequest } from 'next/server';
import { farcasterService } from '@/service/farcaster';
import { checkIfAlreadyMinted, checkIfTransactionIsConfirmed, mintNft } from '@/web3/mint';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as FrameActionPayload;
  // Parse and validate the frame message
  const { isValid, message } = await validateFrameMessage(body);
  if (!isValid || !message) {
    return new Response('Invalid message', { status: 400 });
  }

  const userFid = body.untrustedData.fid;
  const targetFid = body.untrustedData.fid;
  const castHash = body.untrustedData.castId.hash;

  const promises = [];
  promises.push(farcasterService.checkIfFollows(userFid, targetFid));
  promises.push(
    farcasterService.checkIfRecastedFrame(userFid, targetFid, castHash),
  );
  promises.push(farcasterService.getConnectEthAddress(userFid));

  const [[follows], [recasted], [isWalletConnected, ethAddresses]] =
    await Promise.all(promises);

  const fid = body.untrustedData.fid;
  let dbUser = await prisma.user.findUnique({
    where: {
      fid: fid,
    },
  });
  if (!dbUser) {
    // create user
    dbUser = await prisma.user.create({
      data: {
        fid: fid,
      },
    });
  }

  if (!follows) {
    return mustFollowFrame(userFid, targetFid);
  }

  if (!recasted) {
    return mustRecastFrame(userFid, targetFid);
  }

  if (!isWalletConnected) {
    return mustHaveAccountConnected();
  }
  const [userAddress] = ethAddresses.split(',');
  const isAlreadyMinted = await checkIfAlreadyMinted(userAddress);
  if (isAlreadyMinted) {
    // check if 24 passed
    const txInLast24Hours = await prisma.transactions.findMany({
      where: {
        fid: userFid,
        timestamp: {
          gte:
            new Date().getTime() - config.allowMintEveryHours * 60 * 60 * 1000,
        },
      },
    });
    if (txInLast24Hours.length > 0) {
      return alreadyMinted(
        txInLast24Hours[0].txHash,
        txInLast24Hours[0].address,
      );
    }
  }

  const txHash = await mintNft(userAddress);
  const createdEntry = await prisma.transactions.create({
    data: {
      fid: body.untrustedData.fid,
      userId: dbUser?.id!,
      txHash: txHash + '',
      messageHash: body.untrustedData.messageHash,
      status: 'pending',
      network: body.untrustedData.network,
      address: userAddress,
      timestamp: new Date().getTime(),
    },
  });
  if (txHash) {
    const timer = setInterval(async () => {
      // check if transaction is confirmed
      const confirmed = await checkIfTransactionIsConfirmed(txHash as string);
      if (confirmed) {
        await prisma.transactions.update({
          where: {
            id: createdEntry.id,
          },
          data: {
            status: 'confirmed',
          },
        });
        clearInterval(timer);
      }
    }, 5000)
  }
  // logs request body
  prisma.requestLogs.create({
    data: {
      fid: body.untrustedData.fid,
      url: body.untrustedData.url,
      messageHash: body.untrustedData.messageHash,
      timestamp: body.untrustedData.timestamp,
      network: body.untrustedData.network,
      buttonIndex: body.untrustedData.buttonIndex,
      address: '',
      castId: {
        fid: body.untrustedData.castId.fid,
        hash: body.untrustedData.castId.hash,
      },
      trustedData: {
        messageBytes: body.trustedData.messageBytes,
      },
    },
  });
  return mintedSuccessFrame(
    txHash as string,
    userAddress,
  );
}

function mintedSuccessFrame(
  txHash: string,
  address: string,
) {
  const imageUrl = assets.minted;
  // Use the frame message to build the frame
  const frame: Frame = {
    version: 'vNext',
    image: imageUrl,
    buttons: [
      {
        label: `Website 🚀`,
        action: 'link',
        target: config.host,
      },
      {
        label: `Transaction 🧾`,
        action: 'link',
        target: `${config.chain_explorer}/tx/${txHash}`,
      },
      {
        label: `Check NFT 📈`,
        action: 'link',
        target: `${config.chain_explorer}/address/${address}`,
      }
    ],
    ogImage: imageUrl,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}

function alreadyMinted(txHash: string,
  address: string,
) {
  const imageUrl = assets.error.alreadyMinted;
  // Use the frame message to build the frame
  const frame: Frame = {
    version: 'vNext',
    image: imageUrl,
    buttons: [
      {
        label: `Website 🚀`,
        action: 'link',
        target: config.host,
      },
      {
        label: `Transaction 🧾`,
        action: 'link',
        target: `${config.chain_explorer}/tx/${txHash}`,
      },
      {
        label: `Check NFT 📈`,
        action: 'link',
        target: `${config.chain_explorer}/address/${address}`,
      }
    ],
    ogImage: imageUrl,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}

function mustFollowFrame(fid: number, targetFid: number) {
  // Use the frame message to build the frame
  const frame: Frame = {
    version: 'vNext',
    image: assets.error.notFollowing,
    buttons: [
      {
        label: `Follow and Refresh`,
        action: 'post',
      },
    ],
    ogImage: assets.error.notFollowing,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}

function mustRecastFrame(fid: number, targetFid: number) {
  // Use the frame message to build the frame
  const frame: Frame = {
    version: 'vNext',
    image: assets.error.notRecasted,
    buttons: [
      {
        label: `Recast and Refresh`,
        action: 'post',
      },
    ],
    ogImage: assets.error.notRecasted,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}

function mustHaveAccountConnected() {
  // Use the frame message to build the frame
  const frame: Frame = {
    version: 'vNext',
    image: assets.error.walletNotConnected,
    buttons: [
      {
        label: `Connect Wallet and Refresh`,
        action: 'post',
      },
    ],
    ogImage: assets.error.walletNotConnected,
    postUrl: `${config.host}/frames`,
  };

  // Return the frame as HTML
  const html = getFrameHtml(frame);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}
