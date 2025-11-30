import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const MODULE_ADDRESS = "0x155e43ac5e3c045997eae5fc8ccbcf9ddcc8dbd77849e4e54a40aa7d9dfd9ba9";
const MODULE_NAME = "market";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

async function main() {
  console.log(`Checking ${MODULE_ADDRESS}::${MODULE_NAME}...`);
  try {
    const moduleData = await aptos.getAccountModule({
      accountAddress: MODULE_ADDRESS,
      moduleName: MODULE_NAME,
    });
    console.log("Success! Module found.");
    console.log("Bytecode length:", moduleData.bytecode.length);
  } catch (error: any) {
    console.error("Failed to find module.");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Body:", error.body);
  }
}

main();
