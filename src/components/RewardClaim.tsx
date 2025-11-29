import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NeoButton, NeoCard } from "./NeoComponents";
import { Gift, Check, Loader2 } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export function RewardClaim() {
  const claims = useQuery(api.claims.list);
  const markClaimed = useMutation(api.claims.markClaimed);
  const { signAndSubmitTransaction, account } = useWallet();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (claim: any) => {
    if (!account) {
      toast.error("Please connect your wallet to claim rewards");
      return;
    }

    setClaimingId(claim._id);

    try {
      // In a real implementation, this would call the RewardDistributor smart contract
      // const payload = {
      //   type: "entry_function_payload",
      //   function: "0x...::reward_distributor::claim_reward",
      //   type_arguments: [],
      //   arguments: [claim.amount, claim.signature],
      // };
      
      // For this demo, we simulate the transaction by sending a 0 APT transaction to self
      // This proves the user can sign and submit a transaction
      const transaction: InputTransactionData = {
        data: {
          function: "0x1::coin::transfer",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [account.address, "0"], // 0 transfer to self, passed as string
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      
      await markClaimed({ 
        claimId: claim._id as Id<"claims">, 
        transactionHash: response.hash 
      });

      toast.success(`Successfully claimed ${claim.amount.toFixed(2)} ${claim.token}!`, {
        description: `Transaction Hash: ${response.hash.slice(0, 8)}...`
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to claim reward");
    } finally {
      setClaimingId(null);
    }
  };

  if (!claims || claims.length === 0) return null;

  return (
    <NeoCard className="bg-yellow-400/20 border-yellow-600 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6 text-yellow-600" />
        <h2 className="text-xl font-black uppercase text-yellow-800">Claimable Rewards</h2>
      </div>
      
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim._id} className="bg-white border-2 border-black p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <div>
              <p className="font-bold text-lg">{claim.amount.toFixed(2)} {claim.token}</p>
              <p className="text-xs text-muted-foreground font-mono">
                From Bounty #{claim.bountyId.slice(-4)}
              </p>
            </div>
            <NeoButton 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleClaim(claim)}
              disabled={claimingId === claim._id}
            >
              {claimingId === claim._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Claim <Check className="w-4 h-4 ml-1" />
                </>
              )}
            </NeoButton>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}