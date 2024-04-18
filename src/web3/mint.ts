import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import contractAbi from "./contract.json";
export const contractAddress = process.env.CONTRACT_ADDRESS as `0x`;

const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "");

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});


export async function mintNft(toAddress: string) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "safeMint",
      args: [toAddress, "https://jade-neighbouring-caribou-79.mypinata.cloud/ipfs/QmRzgsw2F73LsfLzJ2vcUefyoeyVn4CpyMVoH5vjufciwZ"],
    });
    const transaction = await walletClient.writeContract(request);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function checkIfTransactionIsConfirmed(txHash: string): Promise<boolean> {
  try {
    const result: any = await publicClient.getTransactionConfirmations({
      hash: txHash as `0x`,
    });
    const number = parseInt(result, 16)
    return number > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function checkIfAlreadyMinted(
  toAddress: string
) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "balanceOf",
      args: [toAddress],
    });
    const data = await publicClient.readContract(request) as string;
    const number = parseInt(data, 16)
    return number > 0;
  } catch (error) {
    return false
  }
}