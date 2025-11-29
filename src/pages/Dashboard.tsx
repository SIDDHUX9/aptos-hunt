import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard, NeoBadge } from "@/components/NeoComponents";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Trophy, Plus, Clock, AlertTriangle, Activity, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getBlockHeight, getAptBalance } from "@/lib/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { RewardClaim } from "@/components/RewardClaim";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bounties = useQuery(api.bounties.list);
  const [blockHeight, setBlockHeight] = useState<string>("Loading...");
  const { account, connected } = useWallet();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    const updateHeight = async () => {
      const height = await getBlockHeight();
      if (height) setBlockHeight(height);
    };
    
    const updateBalance = async () => {
      if (connected && account?.address) {
        const bal = await getAptBalance(account.address.toString());
        setWalletBalance(bal);
      }
    };

    updateHeight();
    updateBalance();
    const interval = setInterval(() => {
      updateHeight();
      updateBalance();
    }, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, [connected, account]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Left Panel - User Stats */}
          <div className="lg:col-span-3 space-y-6">
            <NeoCard className="bg-secondary/20">
              <h2 className="text-xl font-bold mb-4 uppercase">Hunter Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground">Account</p>
                  <p className="text-lg font-mono truncate">{user?._id || "Guest"}</p>
                </div>
                
                {connected && (
                  <div className="bg-white/50 p-2 border-2 border-black/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-1">
                      <Wallet className="w-3 h-3" />
                      <span>Petra Wallet</span>
                    </div>
                    <p className="text-xs font-mono truncate mb-1">{account?.address?.toString()}</p>
                    <p className="text-xl font-black text-teal-600">{walletBalance !== null ? walletBalance.toFixed(2) : "..."} APT</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-bold text-muted-foreground">PAT Balance</p>
                  <p className="text-3xl font-black text-primary">{user?.patBalance || 0} PAT</p>
                </div>
                <div className="pt-2 border-t-2 border-black/10">
                   <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                      <Activity className="w-3 h-3" />
                      <span>Aptos Testnet Height</span>
                   </div>
                   <p className="font-mono font-bold">{blockHeight}</p>
                </div>
                <NeoButton className="w-full mt-4" onClick={() => navigate("/create-bounty")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Bounty
                </NeoButton>
              </div>
            </NeoCard>
            
            <NeoCard className="bg-accent/20">
              <h2 className="text-xl font-bold mb-4 uppercase">Referral</h2>
              <p className="text-sm mb-2">Share your link to earn PAT!</p>
              <code className="block bg-black text-white p-2 text-xs mb-2 overflow-hidden">
                /bounty/123?ref={user?._id?.slice(0,8)}
              </code>
              <NeoButton variant="outline" size="sm" className="w-full">Copy Link</NeoButton>
            </NeoCard>
          </div>

          {/* Center - Bounties List */}
          <div className="lg:col-span-6 space-y-6">
            <RewardClaim />
            
            <h1 className="text-4xl font-black uppercase mb-8">Active Bounties</h1>
            
            <div className="grid gap-6">
              {bounties === undefined ? (
                 <div className="text-center py-10 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-muted-foreground">Loading bounties...</p>
                 </div>
              ) : bounties.length === 0 ? (
                 <div className="text-center py-10">No active bounties found. Create one!</div>
              ) : (
                bounties.map((bounty, index) => (
                <motion.div
                  key={bounty._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div onClick={() => navigate(`/bounty/${bounty._id}`)}>
                    <NeoCard className="group cursor-pointer hover:bg-accent/5 transition-colors">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-48 h-48 md:h-32 bg-gray-200 border-2 border-black overflow-hidden relative">
                          <img src={bounty.contentUrl} alt="Bounty Content" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute top-2 left-2">
                            <NeoBadge variant={bounty.status === 'pending' ? 'warning' : bounty.status === 'verified_real' ? 'success' : 'danger'}>
                              {bounty.status === 'pending' ? 'PENDING' : bounty.status === 'verified_real' ? 'REAL' : 'FAKE'}
                            </NeoBadge>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2">
                            <h3 className="text-xl font-bold truncate w-full">Bounty #{bounty._id.slice(-4)}</h3>
                            <div className="flex items-center text-sm font-bold text-muted-foreground whitespace-nowrap">
                              <Clock className="w-4 h-4 mr-1" />
                              {Math.max(0, Math.ceil((bounty.deadline - Date.now()) / 3600000))}h left
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-secondary/20 p-2 border-2 border-black text-center">
                              <p className="text-xs font-bold uppercase">Real Pool</p>
                              <p className="text-lg font-black">{bounty.realPool} APT</p>
                            </div>
                            <div className="bg-destructive/20 p-2 border-2 border-black text-center">
                              <p className="text-xs font-bold uppercase">AI Pool</p>
                              <p className="text-lg font-black">{bounty.aiPool} APT</p>
                            </div>
                          </div>
                          
                          <NeoButton className="w-full group-hover:translate-x-1 group-hover:translate-y-1">
                            Place Bet
                          </NeoButton>
                        </div>
                      </div>
                    </NeoCard>
                  </div>
                </motion.div>
              )))}
            </div>
          </div>

          {/* Right Panel - Leaderboard */}
          <div className="lg:col-span-3">
            <NeoCard className="bg-primary/10 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold uppercase">Top Hunters</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "CryptoKing", score: 5420 },
                  { name: "DeepSlayer", score: 4890 },
                  { name: "PixelHunter", score: 3200 },
                  { name: "AptosWhale", score: 2800 },
                  { name: "VibeCoder", score: 1500 },
                ].map((hunter, i) => (
                  <div key={i} className="flex justify-between items-center border-b-2 border-black/10 pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg w-6">{i + 1}</span>
                      <span className="font-bold">{hunter.name}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{hunter.score}</span>
                  </div>
                ))}
              </div>
            </NeoCard>
          </div>
          
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}