import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Wallet } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { NeoButton } from "@/components/NeoComponents";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const { connect, connected, account, wallets } = useWallet();
  const setWalletAddress = useMutation(api.users.setWalletAddress);
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle the auth flow once wallet is connected
  useEffect(() => {
    const handleAuth = async () => {
      if (connected && account?.address && !authLoading) {
        setIsProcessing(true);
        try {
          // 1. Ensure we have a Convex session (Anonymous)
          if (!isAuthenticated) {
            await signIn("anonymous");
          }

          // 2. Link wallet to user
          await setWalletAddress({ walletAddress: account.address.toString() });

          // 3. Redirect
          const redirect = redirectAfterAuth || "/dashboard";
          toast.success("Wallet Connected", {
            description: "Welcome to Deepfake Hunters"
          });
          navigate(redirect);
        } catch (error) {
          console.error("Auth error:", error);
          toast.error("Authentication Failed", {
            description: "Could not verify wallet identity."
          });
          setIsProcessing(false);
        }
      }
    };

    handleAuth();
  }, [connected, account, authLoading, isAuthenticated, signIn, setWalletAddress, navigate, redirectAfterAuth]);

  const handleConnect = () => {
    const petra = wallets?.find((w) => w.name === "Petra");
    if (petra) {
      connect(petra.name);
    } else if (wallets && wallets.length > 0) {
      connect(wallets[0].name);
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary flex items-center justify-center border-2 border-black">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              Connect Wallet
            </CardTitle>
            <CardDescription className="text-lg font-medium">
              Your wallet is your identity. Connect to start hunting deepfakes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-bold animate-pulse">Verifying Identity...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <NeoButton 
                  onClick={handleConnect} 
                  className="w-full py-6 text-lg flex items-center justify-center gap-2"
                  disabled={isProcessing}
                >
                  <Wallet className="w-5 h-5" />
                  Connect Petra Wallet
                </NeoButton>
                
                <p className="text-xs text-center text-muted-foreground font-mono">
                  By connecting, you agree to our Terms of Service.
                  <br />
                  We use anonymous authentication linked to your wallet address.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}