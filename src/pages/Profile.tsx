import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard } from "@/components/NeoComponents";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "react-router";
import { User, Copy, Wallet, Award } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { address } = useParams();
  const { user } = useAuth();

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://deepfake-hunters.app/bounty/1?ref=${user?._id}`);
    toast.success("Referral link copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-primary border-4 border-black flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Hunter Profile</h1>
            <p className="font-mono text-muted-foreground">{address || user?._id}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <NeoCard className="bg-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <h3 className="font-bold uppercase">Total Earnings</h3>
            </div>
            <p className="text-3xl font-black">{user?.patBalance || 0} PAT</p>
          </NeoCard>
          
          <NeoCard className="bg-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <h3 className="font-bold uppercase">APT Balance</h3>
            </div>
            <p className="text-3xl font-black">{user?.aptBalance || 0} APT</p>
          </NeoCard>

          <NeoCard className="bg-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" />
              <h3 className="font-bold uppercase">Win Rate</h3>
            </div>
            <p className="text-3xl font-black">68%</p>
          </NeoCard>
        </div>

        <NeoCard className="mb-8">
          <h2 className="text-xl font-bold uppercase mb-4">Referral Program</h2>
          <div className="flex gap-4 mb-4">
            <input 
              readOnly 
              value={`https://deepfake-hunters.app/bounty/1?ref=${user?._id?.slice(0,8)}`}
              className="flex-1 border-2 border-black p-2 font-mono bg-gray-100"
            />
            <NeoButton onClick={copyReferral}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </NeoButton>
          </div>
          <div className="bg-black text-white p-4 font-mono text-sm">
            <p>Referred 3 users → Earned 45 PAT</p>
            <p>Referred 1 user → Earned 15 PAT</p>
          </div>
        </NeoCard>

        <h2 className="text-2xl font-black uppercase mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <NeoCard key={i} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">Bet on Bounty #{100+i}</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+ 15 PAT</p>
                <p className="text-xs font-mono">Won Prediction</p>
              </div>
            </NeoCard>
          ))}
        </div>
      </main>
    </div>
  );
}