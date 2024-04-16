import { config } from '@/lib/config';
import axios from 'axios';

const baseURL = config.farcasterHub.url

interface FarcasterErrorResponse {
  errCode: string;
  presentable: boolean;
  name: string;
  code: number;
  details: string;
  metadata: Object
}

interface IVerificationAddBody {
  address: string;
  claimSignature: string;
  blockHash: string;
  verificationType: number,
  chainId: number,
  protocol: string,
  ethSignature: string,
}
interface IVerificationResponseItem {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    verificationAddAddressBody: IVerificationAddBody
    verificationAddEthAddressBody: IVerificationAddBody
  }
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
}


async function checkIfFollows(fid: number, targetFid: number):
  Promise<[boolean, string]> {
  try {
    if (fid === targetFid) {
      return [true, "User follows target"];
    }
    const response = await axios.get(`${baseURL}/v1/linkById?fid=${fid}&target_fid=${targetFid}&link_type=follow`);
    console.log(response.data);
    return [true, response.data];
  } catch (e: any) {
    if (e.response) {
      const statusCode = e.response.status;
      if (statusCode === 400) {
        const data = e.response.data as FarcasterErrorResponse
        if (data?.errCode == 'not_found') {
          return [false, data.details];
        }
      }
      console.error(e);
      return [false, e.response.data];
    }
    console.error(e);
    return [false, e];
  }
}

async function checkIfRecastedFrame(
  fid: number,
  targetFid: number,
  targetFrameHash: string,
): Promise<[boolean, string]> {
  try {
    if (fid === targetFid) {
      return [true, "User has recasted frame"];
    }
    const response = await axios.get(`${baseURL}/v1/reactionById?fid=${fid}&reaction_type=1&target_fid=${targetFid}&target_hash=${targetFrameHash}`);
    console.log(response.data);
    return [true, response.data];
  } catch (e: any) {
    if (e.response) {
      const statusCode = e.response.status;
      if (statusCode === 400) {
        const data = e.response.data as FarcasterErrorResponse
        if (data?.errCode == 'not_found') {
          return [false, data.details];
        }
      }
      console.error(e);
      return [false, e.response.data];
    }
    console.error(e);
    return [false, e];
  }
}

async function getConnectEthAddress(fid: number): Promise<[boolean, string]> {
  try {
    const response = await axios.get(`${baseURL}/v1/verificationsByFid?fid=${fid}`);
    const data = response.data as {
      messages: IVerificationResponseItem[],
    }
    console.log("response.data");
    console.log(response.data);

    const array = data.messages;
    let addresses: string[] = []
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item.data.type === 'MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS') {
        if (item.data.verificationAddEthAddressBody.protocol == "PROTOCOL_ETHEREUM") {
          addresses.push(item.data.verificationAddEthAddressBody.address);
        }
      }
    }
    if (addresses.length === 0) {
      return [false, "No address found"];
    }
    return [true, addresses.toString()];
  } catch (e: any) {
    console.error(e);
    return [false, e];
  }
}

export const farcasterService = {
  checkIfFollows,
  checkIfRecastedFrame,
  getConnectEthAddress,
}