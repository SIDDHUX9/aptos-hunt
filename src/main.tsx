import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import BountyPage from "@/pages/Bounty.tsx";
import Profile from "@/pages/Profile.tsx";
import CreateBounty from "@/pages/CreateBounty.tsx";
import Whitepaper from "@/pages/Whitepaper.tsx";
import FAQ from "@/pages/FAQ.tsx";
import PrivacyPolicy from "@/pages/PrivacyPolicy.tsx";
import TermsOfService from "@/pages/TermsOfService.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./types/global.d.ts";
import { AptosWalletProvider } from "./components/AptosWalletProvider";
import { ThemeProvider } from "next-themes";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <InstrumentationProvider>
        <ConvexAuthProvider client={convex}>
          <AptosWalletProvider>
            <BrowserRouter>
              <RouteSyncer />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-bounty" element={<CreateBounty />} />
                <Route path="/bounty/:id" element={<BountyPage />} />
                <Route path="/profile/:address" element={<Profile />} />
                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </AptosWalletProvider>
        </ConvexAuthProvider>
      </InstrumentationProvider>
    </ThemeProvider>
  </StrictMode>,
);