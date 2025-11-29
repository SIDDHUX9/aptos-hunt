import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard, NeoBadge } from "@/components/NeoComponents";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function BountyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Convex hooks
  const bounty = useQuery(api.bounties.get, { id: id as Id<"bounties"> });
  const placeBetMutation = useMutation(api.bounties.placeBet);
  const resolveBountyMutation = useMutation(api.bounties.resolve);

  const [betAmount, setBetAmount] = useState("1");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (bounty === null) {
      navigate("/dashboard");
    }
  }, [bounty, navigate]);

  if (!bounty) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const handleBet = async (side: boolean) => {
    try {
      await placeBetMutation({
        bountyId: bounty._id,
        amount: Number(betAmount),
        isReal: side
      });
      
      toast.success(`Bet placed on ${side ? "REAL" : "AI"}`, {
        description: `${betAmount} APT deducted from wallet`
      });
    } catch (error) {
      toast.error("Failed to place bet");
      console.error(error);
    }
  };

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    
    // Simulate 2 second delay
    setTimeout(async () => {
      const isReal = Math.random() > 0.5;
      
      try {
        await resolveBountyMutation({
          bountyId: bounty._id,
          isReal
        });
        
        if (isReal) {
          toast.success("Shelby Verdict: REAL", { description: "Winners have been paid out!" });
        } else {
          toast.error("Shelby Verdict: AI GENERATED", { description: "Winners have been paid out!" });
        }
      } catch (error) {
        toast.error("Failed to resolve bounty");
      } finally {
        setIsVerifying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <NeoButton variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            ← Back to Dashboard
          </NeoButton>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-4xl font-black uppercase">Bounty #{bounty._id.slice(-4)}</h1>
            <NeoBadge 
              variant={bounty.status === 'pending' ? 'warning' : bounty.status === 'verified_real' ? 'success' : 'danger'}
              className="text-lg px-4 py-1"
            >
              {bounty.status === 'pending' ? 'VERIFICATION PENDING' : bounty.status === 'verified_real' ? 'VERIFIED REAL' : 'VERIFIED AI'}
            </NeoBadge>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Content Display */}
          <NeoCard className="p-0 overflow-hidden bg-black">
            <div className="relative aspect-video w-full flex items-center justify-center bg-gray-900">
              <img src={bounty.contentUrl} alt="Content" className="max-h-full max-w-full object-contain" />
              
              {/* Overlay for verification status */}
              <AnimatePresence>
                {isVerifying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10"
                  >
                    <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                    <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Shelby AI Scanning...</h3>
                    <p className="text-gray-400 font-mono mt-2">Analyzing pixel patterns & metadata</p>
                  </motion.div>
                )}
                
                {bounty.isResolved && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 pointer-events-none"
                  >
                    <div className={`border-8 ${bounty.isReal ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} p-8 transform -rotate-12 bg-black`}>
                      <h2 className="text-6xl font-black uppercase tracking-tighter">
                        {bounty.isReal ? 'REAL' : 'FAKE'}
                      </h2>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </NeoCard>

          {/* Betting Interface */}
          <div className="grid md:grid-cols-2 gap-8">
            <NeoCard className={`border-green-500 ${bounty.isResolved ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black uppercase text-green-600">Real</h3>
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-black mb-2">{bounty.realPool} APT</div>
              <p className="text-sm text-muted-foreground mb-6">Pool Size</p>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="flex-1 border-2 border-black p-2 font-mono font-bold"
                  disabled={bounty.isResolved}
                />
                <NeoButton 
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                  onClick={() => handleBet(true)}
                  disabled={bounty.isResolved}
                >
                  Bet Real
                </NeoButton>
              </div>
            </NeoCard>

            <NeoCard className={`border-red-500 ${bounty.isResolved ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black uppercase text-red-600">AI Generated</h3>
                <ShieldAlert className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-4xl font-black mb-2">{bounty.aiPool} APT</div>
              <p className="text-sm text-muted-foreground mb-6">Pool Size</p>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="flex-1 border-2 border-black p-2 font-mono font-bold"
                  disabled={bounty.isResolved}
                />
                <NeoButton 
                  className="bg-red-500 hover:bg-red-600 text-white flex-1"
                  onClick={() => handleBet(false)}
                  disabled={bounty.isResolved}
                >
                  Bet AI
                </NeoButton>
              </div>
            </NeoCard>
          </div>

          {/* Admin Panel */}
          <NeoCard className="bg-gray-100 border-dashed">
            <h3 className="font-bold uppercase mb-4 text-gray-500">Admin Controls (Demo Only)</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-mono text-sm">Shelby Oracle Online</span>
              </div>
              <NeoButton 
                onClick={handleSimulateVerification}
                disabled={isVerifying || bounty.isResolved}
                variant="outline"
              >
                {isVerifying ? 'Verifying...' : 'Trigger Shelby Verification'}
              </NeoButton>
            </div>
          </NeoCard>
        </div>
      </main>
    </div>
  );
}