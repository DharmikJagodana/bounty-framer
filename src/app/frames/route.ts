// Route that handles frame actions
import { prisma } from '@/db';
import { Prisma } from "@prisma/client"
import { config } from '@/lib/config';
import { getFrameHtml, validateFrameMessage, Frame, FrameActionPayload } from "frames.js";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  const body = (await request.json()) as FrameActionPayload;
  console.log("body");
  console.log(body);
  // Parse and validate the frame message
  const { isValid, message } = await validateFrameMessage(body);
  if (!isValid || !message) {
    return new Response("Invalid message", { status: 400 });
  }
  // logs request body
  const result = await prisma.requestLogs.create({
    data: {
      fid: body.untrustedData.fid,
      url: body.untrustedData.url,
      messageHash: body.untrustedData.messageHash,
      timestamp: body.untrustedData.timestamp,
      network: body.untrustedData.network,
      buttonIndex: body.untrustedData.buttonIndex,
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

  const randomInt = Math.floor(Math.random() * 100);
  const imageUrlBase = `https://picsum.photos/seed/${randomInt}`;

  // Use the frame message to build the frame
  const frame: Frame = {
    version: "vNext",
    image: `${imageUrlBase}/1146/600`,
    buttons: [
      {
        label: `Next (pressed by ${message.data.fid})`,
        action: "link",
        target: `https://www.google.com/search?q=${randomInt}`,
      },
    ],
    ogImage: `${imageUrlBase}/600`,
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

