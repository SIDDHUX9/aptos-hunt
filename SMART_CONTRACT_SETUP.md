This guide explains how to deploy the Move smart contract to the Aptos Testnet and integrate it with the frontend.

## Prerequisites

1.  **Install Aptos CLI**:
    - Mac: `brew install aptos`
    - Windows/Linux: Follow instructions at [aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli)

2.  **Initialize Aptos CLI**:
    ```bash
    aptos init
    ```
    - Choose `testnet`.
    - It will generate a private key for you.

## Deployment Steps

1.  **Navigate to the Move directory**:
    ```bash
    cd move
    ```

2.  **Compile the Contract**:
    ```bash
    aptos move compile --named-addresses deepfake_hunters=default
    ```

3.  **Publish the Contract**:
    ```bash
    aptos move publish --named-addresses deepfake_hunters=default
    ```
    - Confirm the transaction.
    - **Copy the "package address"** (or your account address) from the output. It will look like `0x123...`.

## Frontend Integration

Once deployed, you need to update the frontend to point to your new contract address.

1.  **Update `src/lib/aptos.ts`**:
    - Add a constant for your module address:
      
2.  **Update `src/pages/Bounty.tsx`**:
    - Replace the simulated transaction logic with a call to your smart contract entry function.
    
    Example for placing a bet:
    ```typescript
    const transaction = {
      data: {
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::place_bet`,
        typeArguments: [],
        functionArguments: [bountyId, isReal, amountInOctas],
      }
    };
    ```

3.  **Update `src/pages/CreateBounty.tsx`**:
    - Call `create_market` on-chain when a bounty is created.

## Contract Functions

- `create_market(content_hash: String, duration: u64)`: Initializes a new prediction market.
- `place_bet(market_id: u64, amount: u64, is_real: bool)`: Stakes APT on an outcome.
- `resolve_market(market_id: u64, is_real: bool)`: **Admin Only**. Resolves the market (called by Veritas Oracle).
- `claim_reward(market_id: u64)`: Winners call this to withdraw their share of the pool.

## Troubleshooting & Redeployment

### When to Republish
You only need to run `aptos move publish` again if:
1. You modified the Move code (e.g., added new events or fixed logic).
2. You want to deploy a fresh instance of the contract.

### After Republishing
**Important:** Every time you publish, you might get a new object address.
1. Copy the new address from the terminal output.
2. Update `src/lib/aptos.ts`:
