import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NeoCard } from "@/components/NeoComponents";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black uppercase mb-8">Privacy Policy</h1>
          
          <NeoCard className="prose max-w-none">
            <p className="font-bold text-muted-foreground mb-6">Last Updated: November 29, 2025</p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">1. Introduction</h2>
            <p>
              Deepfake Hunters ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and disclose your information when you use our decentralized application (dApp).
              By using our platform, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-bold mt-4 mb-2">2.1. Public Blockchain Data</h3>
            <p>
              Your interactions with Deepfake Hunters involve transactions on the Aptos blockchain. 
              Please be aware that your wallet address, transaction history, and token balances are publicly available on the blockchain. 
              We do not control this data and cannot delete it.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">2.2. Content Uploads</h3>
            <p>
              When you create a bounty, the content (images/videos) you upload is stored on the Shelby Protocol, a decentralized storage network. 
              Once uploaded, this content may be permanently accessible and cannot be deleted by us.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">2.3. Non-Personal Information</h3>
            <p>
              We may collect non-personal information about your device, browser, and usage patterns to improve the performance and user experience of our dApp.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our Service.</li>
              <li>To facilitate bounty creation and verification processes.</li>
              <li>To detect and prevent fraud or malicious activity.</li>
              <li>To improve the accuracy of our Veritas AI engine.</li>
            </ul>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">4. Third-Party Services</h2>
            <p>
              We may use third-party services (e.g., Aptos Labs, Shelby Protocol, QuickNode) that collect, monitor, and analyze data. 
              We advise you to review the privacy policies of these third-party services.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">5. Security</h2>
            <p>
              We strive to use commercially acceptable means to protect your information. However, no method of transmission over the internet 
              or method of electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">6. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-2xl font-bold uppercase mt-6 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: 
              <a href="mailto:siddhu3116@gmail.com" className="text-primary font-bold ml-1">siddhu3116@gmail.com</a>
            </p>
          </NeoCard>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
