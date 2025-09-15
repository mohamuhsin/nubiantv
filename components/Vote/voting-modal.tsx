"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VotingModalProps {
  onStartVoting?: (phone: string) => void;
}

export default function VotingModal({ onStartVoting }: VotingModalProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!phone) return alert("Please enter your phone number");
    if (onStartVoting) onStartVoting(phone);
  };

  return (
    <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center">
      <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
        <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Vote Now
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Enter your phone number to cast your vote for your favourite nominees.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 w-full">
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full sm:w-[80%] md:w-[60%] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7d1d] text-sm sm:text-base md:text-lg"
        />

        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 font-semibold text-white bg-[#ff7d1d] hover:bg-[#e66c00] transition-all duration-300 rounded-lg text-sm sm:text-base md:text-lg"
        >
          Submit Vote
        </Button>
      </div>
    </DialogContent>
  );
}
