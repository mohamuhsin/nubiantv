"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { cn } from "@/lib/utils";

import { PhoneInputCustom } from "./phone-input";
import ThankYouModal from "./Thankyou-modal";
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
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export default function VotingModal({
  category,
  isOpen,
  onClose,
}: VotingModalProps) {
  const [nomineeId, setNomineeId] = useState("");
  const [phone, setPhone] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selected = category.nominees.find((n) => n._id === nomineeId);

  useEffect(() => {
    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => setFingerprint(result.visitorId))
      .catch(() => setFingerprint(null));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setNomineeId("");
      setPhone(undefined);
      setError(null);
      setShowThankYou(false);
      setSelectedNominee(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [isOpen]);

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

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (!selected)
          return setError("Selected nominee not found. Please try again.");
        toast.success("You voted successfully!");
        setSelectedNominee(selected);
        setShowThankYou(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowThankYou(false);
          onClose();
        }, 10000);
      } else {
        setError(data.error || "Failed to submit vote. Please try again.");
      }
    } catch (err) {
      console.error("Vote submit error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" />

          <DialogContent
            className={cn(
              "w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px]",
              "rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12",
              "flex flex-col items-center justify-center text-center bg-white shadow-2xl"
            )}
          >
            {!showThankYou && (
              <>
                {/* Header */}
                <DialogHeader className="flex flex-col items-center justify-center space-y-4 w-full text-center">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 w-full text-center leading-tight">
                    Vote in {category.name}
                  </DialogTitle>
                </DialogHeader>

                {/* Nominee select */}
                <div className="mt-6 w-full flex justify-center">
                  <div className="w-full max-w-[600px]">
                    <Select value={nomineeId} onValueChange={setNomineeId}>
                      <SelectTrigger className="w-full h-14 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm hover:shadow-md transition">
                        <SelectValue placeholder="-- Select Nominee --" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {category.nominees.map((n) => (
                          <SelectItem key={n._id} value={n._id}>
                            {n.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Phone input */}
                <div className="mt-6 w-full flex justify-center">
                  <div className="w-full max-w-[600px]">
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
                  <p className="text-red-500 text-sm mt-3 text-center font-medium break-words">
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  className={cn(
                    "mt-8 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 px-6 py-4 font-semibold text-white rounded-xl",
                    "bg-[#ff7d1d] hover:bg-[#e66c00] transition-all duration-300 text-lg shadow-md hover:shadow-lg"
                  )}
                  disabled={loading}
                >
                  {loading ? "Submitting Vote..." : "Submit Vote"}
                </Button>
              </>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {showThankYou && selectedNominee && (
        <ThankYouModal
          isOpen={showThankYou}
          onClose={() => {
            setShowThankYou(false);
            onClose();
          }}
          nomineeName={selectedNominee.name}
          categoryName={category.name}
        />
      )}
    </>
  );
}
