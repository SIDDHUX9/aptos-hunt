import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeoCard, NeoButton } from "@/components/NeoComponents";
import { motion } from "framer-motion";
import { FileText, Shield, Database, Cpu, Coins } from "lucide-react";

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Whitepaper</h1>
            <p className="text-xl text-muted-foreground font-mono">Deepfake Hunters Protocol v1.0</p>
            <p className="text-sm text-muted-foreground font-mono mt-2">Published: November 2025</p>
          </div>

          <div className="space-y-8">
            {/* Abstract */}
            <NeoCard>
              <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" /> 1. Abstract
              </h2>
              <p className="text-lg leading-relaxed">
                Deepfake Hunters is a decentralized prediction market designed to combat the proliferation of AI-generated misinformation. 
                By leveraging the Aptos blockchain for transparent settlement, the Shelby Protocol for immutable content archiving, 
                and the Veritas AI engine for probabilistic verification, we create a trustless ecosystem where users are incentivized 
                to identify and flag synthetic media.
              </p>
            </NeoCard>

            {/* The Problem */}
            <NeoCard className="bg-red-50 border-red-200">
              <h2 className="text-2xl font-black uppercase mb-4 text-red-900">2. The Problem</h2>
              <p className="mb-4">
                The rise of Generative Adversarial Networks (GANs) has made hyper-realistic deepfakes accessible to anyone. 
                Traditional social media platforms struggle to moderate this content at scale, leading to:
              </p>
              <ul className="list-disc list-inside space-y-2 font-bold ml-4">
                <li>Viral misinformation campaigns</li>
                <li>Identity theft and reputation damage</li>
                <li>Erosion of trust in digital media</li>
              </ul>
            </NeoCard>

            {/* The Solution */}
            <NeoCard className="bg-green-50 border-green-200">
              <h2 className="text-2xl font-black uppercase mb-4 text-green-900">3. The Solution</h2>
              <p className="mb-4">
                We propose a "Truth-to-Earn" model where the community and AI work in tandem:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 border-2 border-green-900">
                  <h3 className="font-black uppercase mb-2">Prediction Market</h3>
                  <p className="text-sm">Users stake APT on whether content is Real or AI. This "skin in the game" ensures honest participation.</p>
                </div>
                <div className="bg-white p-4 border-2 border-green-900">
                  <h3 className="font-black uppercase mb-2">Veritas Oracle</h3>
                  <p className="text-sm">Our proprietary AI engine analyzes artifacts (ELA, frequency analysis) to resolve markets objectively.</p>
                </div>
              </div>
            </NeoCard>

            {/* Technology Stack */}
            <NeoCard>
              <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                <Cpu className="w-6 h-6" /> 4. Technology Architecture
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" /> Aptos Blockchain
                  </h3>
                  <p>
                    Chosen for its high throughput and low latency (Move language). All bets are settled on-chain via smart contracts, 
                    ensuring funds are never held by a centralized custodian.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-secondary" /> Shelby Protocol
                  </h3>
                  <p>
                    Content is hashed and stored on the Shelby decentralized storage network. This prevents evidence tampering 
                    and ensures a permanent record of the analyzed media.
                  </p>
                </div>
              </div>
            </NeoCard>

            {/* Tokenomics */}
            <NeoCard>
              <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                <Coins className="w-6 h-6" /> 5. Tokenomics
              </h2>
              <p className="mb-4">The ecosystem utilizes a dual-token structure:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-black text-white px-2 font-bold">APT</div>
                  <div>
                    <span className="font-bold">Settlement Token:</span> Used for placing bets and paying out rewards. 
                    Ensures liquidity and real value transfer.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-white px-2 font-bold">PAT</div>
                  <div>
                    <span className="font-bold">Reputation Token:</span> Proof of Authenticity Token. Non-transferable (Soulbound) 
                    points earned by correct predictions and bounty creation. High PAT scores unlock governance rights.
                  </div>
                </li>
              </ul>
            </NeoCard>

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground font-mono border-t-2 border-gray-200 pt-4 mt-8">
              <p>© 2025 Deepfake Hunters. This whitepaper is for informational purposes only and does not constitute financial advice.</p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
