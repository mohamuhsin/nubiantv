"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isValidPhoneNumber } from "libphonenumber-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { cn } from "@/lib/utils";

import { PhoneInputCustom } from "./phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Nominee {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  nominees: Nominee[];
}

interface VotingModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteSuccess?: () => void;
}

export default function VotingModal({
  category,
  isOpen,
  onClose,
  onVoteSuccess,
}: VotingModalProps) {
  const [nomineeId, setNomineeId] = useState("");
  const [phone, setPhone] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Load device fingerprint
  useEffect(() => {
    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch {
        setFingerprint(null);
      }
    };
    loadFingerprint();
  }, []);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setNomineeId("");
      setPhone(undefined);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = async () => {
    setError(null);

    if (!nomineeId) return setError("Please select a nominee.");
    if (!phone) return setError("Please enter your phone number.");
    if (!isValidPhoneNumber(phone))
      return setError("Please enter a valid international phone number.");
    if (!fingerprint)
      return setError("Unable to verify your device. Refresh and try again.");

    setLoading(true);
    try {
      const res = await fetch("/api/submit-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          nomineeId,
          categoryId: category._id,
          fingerprint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit vote. Please try again.");
      } else {
        onVoteSuccess?.();
        onClose();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" />
        <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center bg-white shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <DialogHeader className="flex flex-col items-center justify-center w-full text-center space-y-4">
            <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 w-full text-center">
              Vote in {category.name}
            </DialogTitle>
          </DialogHeader>

          {/* Nominee select */}
          <div className="mt-6 w-full flex justify-center">
            <Select value={nomineeId} onValueChange={setNomineeId}>
              <SelectTrigger className="w-full sm:w-4/5 md:w-3/5 h-14 rounded-xl border border-gray-300 text-center text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mx-auto shadow-sm hover:shadow-md transition">
                <SelectValue placeholder="-- Select Nominee --" />
              </SelectTrigger>
              <SelectContent className="w-full sm:w-4/5 md:w-3/5 mx-auto">
                {category.nominees.map((n) => (
                  <SelectItem key={n._id} value={n._id}>
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone input */}
          <div className="mt-6 w-full flex justify-center">
            <div className="w-full sm:w-4/5 md:w-3/5 mx-auto">
              <PhoneInputCustom
                value={phone}
                onChange={setPhone}
                defaultCountry="UG"
                error={error ?? null}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center font-medium">
              {error}
            </p>
          )}

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            className={cn(
              "mt-8 w-full sm:w-4/5 md:w-3/5 px-6 py-4 font-semibold text-white rounded-xl mx-auto",
              "bg-[#ff7d1d] hover:bg-[#e66c00] transition-all duration-300 text-lg shadow-md hover:shadow-lg"
            )}
            disabled={loading}
          >
            {loading ? "Submitting Vote..." : "Submit Vote"}
          </Button>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
