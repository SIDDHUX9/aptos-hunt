import { Link, useNavigate } from "react-router";
import { NeoButton } from "./NeoComponents";
import { useAuth } from "@/hooks/use-auth";
import { User, Moon, Sun } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { useTheme } from "next-themes";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="border-b-4 border-black dark:border-white bg-white dark:bg-black p-4 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors">
          Deepfake<span className="text-primary">Hunters</span>
        </Link>
        
        <div className="flex gap-4 items-center">
          <NeoButton variant="ghost" className="hidden md:flex" onClick={() => navigate("/dashboard")}>
            Dashboard
          </NeoButton>
          
          <WalletConnect />

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

          {isAuthenticated ? (
            <NeoButton variant="outline" className="flex items-center gap-2" onClick={() => navigate(`/profile/${user?._id}`)}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </NeoButton>
          ) : (
            <NeoButton onClick={() => navigate("/auth")}>Login</NeoButton>
          )}
        </div>
      </div>
    </nav>
  );
}