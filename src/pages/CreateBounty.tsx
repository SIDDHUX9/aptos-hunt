import { Navbar } from "@/components/Navbar";
import { NeoButton, NeoCard } from "@/components/NeoComponents";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Link as LinkIcon, Database } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { uploadToShelby } from "@/lib/shelby";
import { useRef } from "react";

export default function CreateBounty() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBounty = useMutation(api.bounties.create);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await processBountyCreation(url);
  };

  const processBountyCreation = async (contentUrl: string) => {
    setIsSubmitting(true);
    try {
      const bountyId = await createBounty({ contentUrl });
      
      toast.success("Bounty Created!", {
        description: "Content secured on Shelby Protocol. 10 PAT reward added."
      });
      
      navigate(`/bounty/${bountyId}`);
    } catch (error) {
      toast.error("Failed to create bounty");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    toast.info("Uploading to Shelby Protocol...", { duration: 2000 });

    try {
      const result = await uploadToShelby(file);
      if (result.success && result.url) {
        setUrl(result.url);
        toast.success("File uploaded to Shelby!", {
            description: `CID: ${result.cid}`
        });
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 max-w-2xl">
        <h1 className="text-4xl font-black uppercase mb-8">Create New Bounty</h1>
        
        <NeoCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold uppercase mb-2">Content URL</label>
              <div className="flex gap-2">
                <div className="bg-gray-100 border-2 border-black p-2 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  className="flex-1 border-2 border-black p-2 font-mono"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required={!url}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Paste a link to the image or video. We will archive it on Shelby.
              </p>
            </div>

            <div 
                className="border-2 border-dashed border-black p-8 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative"
                onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-bold">Or upload file directly</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                <Database className="w-3 h-3" />
                <span>Powered by Shelby Storage</span>
              </div>
            </div>

            <NeoButton type="submit" className="w-full" disabled={isSubmitting || !url}>
              {isSubmitting ? "Processing..." : "Create Bounty & Earn 10 PAT"}
            </NeoButton>
          </form>
        </NeoCard>
      </main>
    </div>
  );
}