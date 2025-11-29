import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Use official Testnet URL as primary
const OFFICIAL_TESTNET_URL = "https://api.testnet.aptoslabs.com/v1";

// Allow overriding via env vars, but default to official
const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || OFFICIAL_TESTNET_URL;
const API_KEY = import.meta.env.VITE_APTOS_API_KEY;

export const MODULE_ADDRESS = "0x155e43ac5e3c045997eae5fc8ccbcf9ddcc8dbd77849e4e54a40aa7d9dfd9ba9";
export const MODULE_NAME = "market";

// Force Testnet configuration
// Only use API_KEY if it is set and looks valid (not a placeholder)
const validApiKey = API_KEY && API_KEY !== "demo_key" && !API_KEY.includes("placeholder") && API_KEY !== "undefined" ? API_KEY : undefined;

console.log("Aptos Client Initialized with Node URL:", NODE_URL);

const config = new AptosConfig({
  network: Network.TESTNET,
  // Only override fullnode if it's explicitly different from the official one
  // This allows the SDK to use its internal defaults/rotation for the official network if we are just using the default URL
  fullnode: NODE_URL !== OFFICIAL_TESTNET_URL ? NODE_URL : undefined,
  clientConfig: validApiKey ? { API_KEY: validApiKey } : undefined,
});

export const aptos = new Aptos(config);

// Helper to fund account (Testnet only)
export const fundAccount = async (address: string, amount: number) => {
  try {
    await aptos.fundAccount({
      accountAddress: address,
      amount: amount,
    });
  } catch (error) {
    console.error("Failed to fund account:", error);
    throw error;
  }
};

// Helper to get APT balance (CoinStore)
export const getAptBalance = async (address: string): Promise<number> => {
  try {
    const resource = await aptos.getAccountCoinAmount({
      accountAddress: address,
      faMetadataAddress: "0x1::aptos_coin::AptosCoin",
    });
    // Convert Octas to APT (8 decimals)
    return resource / 100_000_000;
  } catch (error) {
    console.error("Failed to fetch APT balance:", error);
    return 0;
  }
};

export const getBlockHeight = async () => {
  try {
    const info = await aptos.getLedgerInfo();
    return info.block_height;
  } catch (error) {
    console.error("Failed to get block height:", error);
    return null;
  }
};