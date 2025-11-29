import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard } from "@/components/NeoComponents";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Link as LinkIcon, Database, Youtube, Twitter, Instagram, Video, Wallet } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { uploadToShelby } from "@/lib/shelby";
import { useRef } from "react";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { getYoutubeThumbnail, isYoutubeUrl } from "@/lib/utils";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS, MODULE_NAME, aptos } from "@/lib/aptos";

export default function CreateBounty() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBounty = useMutation(api.bounties.create);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // @ts-ignore
  const { signAndSubmitTransaction, account, connected } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await processBountyCreation(url);
  };

  const processBountyCreation = async (contentUrl: string) => {
    if (!account || !connected) {
      toast.error("Please connect your wallet to create a bounty on-chain");
      return;
    }

    setIsSubmitting(true);
    try {
      toast.info("Creating market on Aptos Blockchain...");
      
      // 1. Create Market on Chain
      const transaction: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_market`,
          typeArguments: [],
          functionArguments: [contentUrl, "86400"], // 24 hours in seconds
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      toast.loading("Waiting for transaction confirmation...", { duration: 5000 });
      
      let committedTxn;
      let marketId: number | undefined = undefined;
      let txnHash = response.hash;

      try {
        committedTxn = await aptos.waitForTransaction({ transactionHash: response.hash });
        
        // @ts-ignore
        if (!committedTxn.success) {
          // @ts-ignore
          throw new Error(`Transaction failed: ${committedTxn.vm_status}`);
        }

        // Attempt to extract marketId from events
        // @ts-ignore
        if (committedTxn.events) {
          // @ts-ignore
          for (const event of committedTxn.events) {
            if ((event.type.includes("MarketCreatedEvent") || event.data?.market_id) && event.data?.market_id) {
               marketId = Number(event.data.market_id);
               break;
            }
          }
        }
      } catch (error: any) {
        console.error("Transaction confirmation failed:", error);
        // If it's a JSON parse error (Unauthorized) or 401, we assume success but can't read events
        if (error.message && (error.message.includes("Unexpected token") || error.message.includes("JSON") || error.message.includes("401"))) {
           toast.warning("Could not verify transaction details (Node Unauthorized), but transaction likely succeeded. Saving bounty...");
           // We proceed without marketId, but save the hash
        } else {
           throw new Error(`Failed to confirm transaction: ${error.message || "Unknown error"}`);
        }
      }

      if (marketId === undefined) {
        console.warn("Could not find market_id in transaction events. Proceeding with hash only.");
      } else {
        console.log("Market Created with ID:", marketId);
      }

      // 2. Create Bounty in Convex
      try {
        const bountyId = await createBounty({ 
          contentUrl,
          marketId: marketId,
          creationTxnHash: txnHash
        });
        
        toast.success("Bounty Created Successfully!", {
          description: `Market ID: ${marketId || 'Pending Sync'} | 10 PAT reward added.`
        });
        
        navigate(`/bounty/${bountyId}`);
      } catch (convexError: any) {
        console.error("Convex creation failed:", convexError);
        throw new Error(`Failed to save bounty to database: ${convexError.message}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create bounty: " + (error.message || "Unknown error"));
      if (error.message && error.message.includes("rejected")) {
        toast.error("Transaction rejected by user");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    toast.info("Uploading to Shelby Protocol...", { duration: 2000 });

    try {
      const result = await uploadToShelby(file);
      if (result.success && result.url) {
        setUrl(result.url);
        toast.success("File uploaded to Shelby!", {
            description: `CID: ${result.cid}`
        });
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage = isYoutubeUrl(url) ? getYoutubeThumbnail(url) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 max-w-2xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black uppercase mb-8">Create New Bounty</h1>
          
          <NeoCard>
            {!connected ? (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">Wallet Connection Required</h2>
                <p className="text-muted-foreground mb-6">You must connect your Aptos wallet to create an on-chain prediction market.</p>
                <NeoButton onClick={() => document.querySelector<HTMLButtonElement>('.wallet-adapter-button')?.click()}>
                  Connect Wallet
                </NeoButton>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-bold uppercase mb-2">Content URL</label>
                <div className="flex gap-2">
                  <div className="bg-gray-100 border-2 border-black p-2 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="flex-1 border-2 border-black p-2 font-mono"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required={!url}
                  />
                </div>
                
                {previewImage && (
                  <div className="mt-4 border-2 border-black bg-black">
                    <p className="text-white text-xs font-bold uppercase p-1">Preview</p>
                    <img src={previewImage} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-sm">
                  <p className="text-xs font-bold uppercase text-blue-800 mb-2">Supported Platforms</p>
                  <div className="flex flex-wrap gap-4 text-sm text-blue-900">
                    <div className="flex items-center gap-1"><Youtube className="w-4 h-4" /> YouTube</div>
                    <div className="flex items-center gap-1"><Video className="w-4 h-4" /> TikTok</div>
                    <div className="flex items-center gap-1"><Instagram className="w-4 h-4" /> Instagram</div>
                    <div className="flex items-center gap-1"><Twitter className="w-4 h-4" /> X (Twitter)</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  Paste a link to the image or video. We will archive it on Shelby.
                </p>
              </div>

              <div 
                  className="border-2 border-dashed border-black p-8 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative"
                  onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-bold">Or upload file directly</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Database className="w-3 h-3" />
                  <span>Powered by Shelby Storage</span>
                </div>
              </div>

              <NeoButton type="submit" className="w-full" disabled={isSubmitting || !url}>
                {isSubmitting ? "Processing On-Chain..." : "Create Bounty & Earn 10 PAT"}
              </NeoButton>
            </form>
            )}
          </NeoCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}