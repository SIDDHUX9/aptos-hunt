import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { NeoButton, NeoCard } from "@/components/NeoComponents";
import { ArrowRight, Shield, Zap, Trophy, Wallet, Database, Moon, Sun } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const TypewriterText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0, delay: delay + i * 0.15 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const TypewriterCycle = ({ 
  words, 
  className, 
  delay = 0 
}: { 
  words: string[]; 
  className?: string; 
  delay?: number 
}) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    const currentWord = words[wordIndex % words.length];
    const typeSpeed = isDeleting ? 75 : 150;
    const pauseDuration = 2500;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, hasStarted, words]);

  return (
    <span className={className}>
      {text}
    </span>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors">
      {/* Hero Section */}
      <header className="border-b-4 border-black dark:border-white bg-white dark:bg-black p-4 sticky top-0 z-50 transition-colors">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-black uppercase tracking-tighter">
            Deepfake<span className="text-primary">Hunters</span>
          </div>
          <div className="flex gap-2 items-center">
            <NeoButton 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </NeoButton>
            <NeoButton onClick={() => navigate("/auth")}>Login to Hunt</NeoButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6 min-h-[160px] md:min-h-[200px]">
            <div className="block">
              <TypewriterText text="Hunt " delay={0} />
              <TypewriterCycle words={["Deepfakes", "AI Lies", "Synthetics", "Falsehoods"]} className="text-primary" delay={0.8} />
              <TypewriterText text="." delay={2.2} />
            </div>
            <div className="block">
              <TypewriterText text="Earn " delay={2.3} />
              <TypewriterCycle words={["Crypto", "Trust", "Rewards", "APT"]} className="text-secondary" delay={3.1} />
              <TypewriterText text="." delay={4.1} />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 4.2, duration: 0.8, repeat: Infinity }}
                className="inline-block w-4 h-12 md:h-20 bg-black ml-2 align-middle"
              />
            </div>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.3 }}
            className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12 text-muted-foreground"
          >
            The first prediction market for viral content authenticity. 
            Bet on Real vs AI. Verified by Veritas AI. Content secured on Shelby Protocol.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5 }}
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

        {/* How It Works Section */}
        <section className="py-20 bg-white border-y-4 border-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 text-center">How It Works</h2>
            <p className="text-center text-lg font-bold text-muted-foreground mb-16 max-w-2xl mx-auto">
              Join the fight against deepfakes in 4 simple steps. Earn crypto while protecting truth.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <NeoCard className="bg-blue-50 border-blue-500 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white text-3xl font-black mb-4 border-2 border-black">
                    1
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 text-blue-700">Connect Wallet</h3>
                  <p className="font-bold text-gray-700 mb-4">
                    Link your Petra Wallet to the Aptos Testnet. Your wallet is your identity—no email required.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-mono">
                    <Wallet className="w-4 h-4" />
                    <span>Petra Wallet Required</span>
                  </div>
                </NeoCard>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <NeoCard className="bg-green-50 border-green-500 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white text-3xl font-black mb-4 border-2 border-black">
                    2
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 text-green-700">Create Bounty</h3>
                  <p className="font-bold text-gray-700 mb-4">
                    Submit suspicious content (images/videos). We archive it on Shelby Protocol and create an on-chain market.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-mono">
                    <Database className="w-4 h-4" />
                    <span>Earn 10 PAT Tokens</span>
                  </div>
                </NeoCard>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <NeoCard className="bg-yellow-50 border-yellow-500 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 text-white text-3xl font-black mb-4 border-2 border-black">
                    3
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 text-yellow-700">Place Bets</h3>
                  <p className="font-bold text-gray-700 mb-4">
                    Stake APT tokens on whether content is Real or AI-Generated. All bets are recorded on-chain.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-yellow-600 font-mono">
                    <Zap className="w-4 h-4" />
                    <span>Minimum 1 APT</span>
                  </div>
                </NeoCard>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <NeoCard className="bg-purple-50 border-purple-500 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-500 text-white text-3xl font-black mb-4 border-2 border-black">
                    4
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 text-purple-700">Claim Rewards</h3>
                  <p className="font-bold text-gray-700 mb-4">
                    Veritas AI resolves the market. Winners split the losing pool proportionally. Claim your APT!
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-600 font-mono">
                    <Trophy className="w-4 h-4" />
                    <span>Winner Takes All</span>
                  </div>
                </NeoCard>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <NeoButton size="lg" className="text-xl px-12 py-6" onClick={() => navigate("/auth")}>
                Start Your First Hunt <ArrowRight className="ml-2" />
              </NeoButton>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-primary/5 border-y-4 border-black">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <NeoCard className="bg-white rotate-1 hover:rotate-0 transition-transform">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-2xl font-black uppercase mb-2">Verify Content</h3>
              <p className="font-bold text-muted-foreground">
                Use our Veritas Oracle to cryptographically prove if content is real or AI-generated.
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
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.img} alt="Bounty" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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

      <Footer />
    </div>
  );
}