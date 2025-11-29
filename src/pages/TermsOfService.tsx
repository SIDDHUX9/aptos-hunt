import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeoCard } from "@/components/NeoComponents";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black uppercase mb-8">Terms of Service</h1>
          
          <NeoCard className="prose max-w-none">
            <p className="font-bold text-muted-foreground mb-6">Effective Date: November 29, 2025</p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Deepfake Hunters platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">2. Description of Service</h2>
            <p>
              Deepfake Hunters is a decentralized prediction market for verifying content authenticity. 
              Users can submit content, place bets using cryptocurrency, and participate in the verification process.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">3. Risk Disclosure</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-bold text-red-900">
                WARNING: Cryptocurrency and blockchain interactions involve significant risk.
              </p>
              <p className="text-sm text-red-800 mt-2">
                You acknowledge that the value of cryptocurrencies can be extremely volatile. 
                Smart contracts may contain bugs or vulnerabilities. You are solely responsible for any loss of funds.
              </p>
            </div>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Upload illegal, harmful, or explicitly prohibited content.</li>
              <li>Manipulate the outcome of bounties through collusion or exploits.</li>
              <li>Interfere with the proper working of the Service or the underlying blockchain.</li>
            </ul>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding user-uploaded content), features, and functionality are and will remain 
              the exclusive property of Deepfake Hunters and its licensors.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall Deepfake Hunters, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the project is based, 
              without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">8. Contact</h2>
            <p>
              For any questions regarding these Terms, please contact us at: 
              <a href="mailto:siddhu3116@gmail.com" className="text-primary font-bold ml-1">siddhu3116@gmail.com</a>
            </p>
          </NeoCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
