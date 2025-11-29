import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { NeoButton, NeoCard } from "@/components/NeoComponents";
import { ArrowRight, Shield, Zap, Trophy } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Hero Section */}
      <header className="border-b-4 border-black bg-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-black uppercase tracking-tighter">
            Deepfake<span className="text-primary">Hunters</span>
          </div>
          <NeoButton onClick={() => navigate("/auth")}>Login to Hunt</NeoButton>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-6"
          >
            Hunt <span className="text-primary">Deepfakes</span>.<br />
            Earn <span className="text-secondary">Crypto</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12 text-muted-foreground"
          >
            The first prediction market for viral content authenticity. 
            Bet on Real vs AI. Verified by Shelby Oracle.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <NeoButton size="lg" className="text-xl px-8 py-6 w-full md:w-auto" onClick={() => navigate("/auth")}>
              Start Hunting <ArrowRight className="ml-2" />
            </NeoButton>
            <NeoButton variant="outline" size="lg" className="text-xl px-8 py-6 w-full md:w-auto" onClick={() => navigate("/dashboard")}>
              View Bounties
            </NeoButton>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 bg-primary/5 border-y-4 border-black">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <NeoCard className="bg-white rotate-1 hover:rotate-0 transition-transform">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-2xl font-black uppercase mb-2">Verify Content</h3>
              <p className="font-bold text-muted-foreground">
                Use our Shelby Oracle to cryptographically prove if content is real or AI-generated.
              </p>
            </NeoCard>
            
            <NeoCard className="bg-white -rotate-1 hover:rotate-0 transition-transform">
              <Zap className="w-12 h-12 mb-4 text-secondary" />
              <h3 className="text-2xl font-black uppercase mb-2">Instant Rewards</h3>
              <p className="font-bold text-muted-foreground">
                Win APT for correct predictions and earn PAT tokens for every contribution.
              </p>
            </NeoCard>
            
            <NeoCard className="bg-white rotate-1 hover:rotate-0 transition-transform">
              <Trophy className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-2xl font-black uppercase mb-2">Climb Ranks</h3>
              <p className="font-bold text-muted-foreground">
                Top hunters get exclusive access to high-stakes bounties and airdrops.
              </p>
            </NeoCard>
          </div>
        </section>

        {/* Live Bounties Preview */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-4xl font-black uppercase mb-12 text-center">Live Bounties</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop", status: "PENDING" },
              { img: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2600&auto=format&fit=crop", status: "PENDING" },
              { img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop", status: "VERIFIED REAL" },
            ].map((item, i) => (
              <NeoCard key={i} className="p-0 overflow-hidden group cursor-pointer">
                <div className="relative aspect-square">
                  <img src={item.img} alt="Bounty" className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-black text-white px-3 py-1 font-bold text-sm border-2 border-white">
                      {item.status}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <NeoButton>View Bounty</NeoButton>
                  </div>
                </div>
              </NeoCard>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-12 border-t-4 border-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black uppercase mb-4">Deepfake Hunters</h2>
          <p className="font-mono text-gray-400">
            Built for the Aptos & Photon Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}