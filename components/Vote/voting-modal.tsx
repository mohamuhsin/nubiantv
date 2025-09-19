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
  const [phone, setPhone] = useState<string | undefined>();
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
      return setError("Please enter a valid phone number.");
    if (!fingerprint)
      return setError("Unable to verify your device. Refresh and try again.");

    setLoading(true);
    try {
      const res = await fetch("/api/request_otp", {
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
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg sm:max-w-md md:max-w-xl rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-col items-center justify-center text-center space-y-4">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Vote in {category.name}
            </DialogTitle>
          </DialogHeader>

          {/* Nominee select using Tailwind */}
          <div className="mt-6 w-full sm:w-4/5 md:w-3/5">
            <select
              value={nomineeId}
              onChange={(e) => setNomineeId(e.target.value)}
              className="w-full h-12 px-3 rounded-lg border border-gray-300 text-center text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">-- Select Nominee --</option>
              {category.nominees.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone input */}
          <div className="mt-4 w-full sm:w-4/5 md:w-3/5">
            <PhoneInputCustom
              value={phone}
              onChange={setPhone}
              defaultCountry="UG"
              error={error ?? null}
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            className={cn(
              "mt-6 w-full sm:w-auto px-6 py-3 font-semibold text-white rounded-lg",
              "bg-[#ff7d1d] hover:bg-[#e66c00] transition-all duration-300 text-sm sm:text-base md:text-lg"
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
