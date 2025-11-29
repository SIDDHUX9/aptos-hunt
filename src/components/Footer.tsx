import { NeoButton } from "./NeoComponents";
import { Mail, FileText, HelpCircle, Github, Twitter } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Deepfake<span className="text-primary">Hunters</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm">
              The first decentralized prediction market for content authenticity. 
              Verify truth. Earn crypto.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold uppercase mb-4 text-lg">Platform</h3>
            <ul className="space-y-2 text-gray-400 font-mono text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/create-bounty" className="hover:text-white transition-colors">Create Bounty</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Connect Wallet</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold uppercase mb-4 text-lg">Resources</h3>
            <ul className="space-y-2 text-gray-400 font-mono text-sm">
              <li>
                <Link to="/whitepaper" className="hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Whitepaper
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold uppercase mb-4 text-lg">Contact</h3>
            <div className="space-y-2 text-gray-400 font-mono text-sm">
              <p>Have questions or found a bug?</p>
              <a href="mailto:siddhu3116@gmail.com" className="flex items-center gap-2 text-white hover:text-primary transition-colors font-bold">
                <Mail className="w-4 h-4" /> siddhu3116@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <p>© 2025 Deepfake Hunters. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}