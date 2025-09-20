"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomineeName: string;
  categoryName: string;
}

export default function ThankYouModal({
  isOpen,
  onClose,
  nomineeName,
  categoryName,
}: ThankYouModalProps) {
  const shareMessage = `I just voted for ${nomineeName} in the ${categoryName} category in the Nubian TV Awards. Vote here 👉`;

  if (!isOpen) return null;

  const handleShare = async () => {
    // Web Share API works only on secure contexts (HTTPS) or localhost (but limited)
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: "Nubian TV Awards 2025",
          text: shareMessage,
          url: "https://nubiantv.live/awards",
        });
        toast.success("Vote shared successfully!");
      } catch (err) {
        console.error("Share failed:", err);
        toast.error("Sharing failed. Copy manually.");
      }
    } else {
      toast(
        "Sharing not supported in this browser or context. Use Copy instead."
      );
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
        toast.success("Copied to clipboard!");
      } else {
        // fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = shareMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Copied to clipboard!");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy. Copy manually.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md rounded-2xl p-6 flex flex-col items-center justify-center text-center mx-auto">
        <DialogHeader className="flex flex-col items-center space-y-3 text-center w-full">
          <DialogTitle className="text-2xl font-bold w-full text-center">
            Vote Recorded!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground w-full text-center">
            Thank you for voting for{" "}
            <span className="text-[#ff7d1d] font-semibold">{nomineeName}</span>{" "}
            in the <strong>{categoryName}</strong> category!
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6 text-sm break-words text-center w-full">
          {shareMessage}
        </div>

        <div className="flex gap-4 w-full max-w-sm justify-center">
          <Button
            onClick={handleShare}
            className="flex-1 bg-[#ff7d1c] text-white py-2 rounded-lg"
          >
            Share
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 border-[#ff7d1c] text-[#ff7d1c] py-2 rounded-lg"
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
