"use client";

import { useState, useEffect } from "react";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import CountdownModal from "./countdown-modal";
import VotingModal from "./voting-modal";
import EndedModal from "./ended-modal";

interface Nominee {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  nominees: Nominee[];
}

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function VoteModal({ open, category }: VoteModalProps) {
  const { status, votingStart } = useVotingStatus();
  const [isVotingOpen, setIsVotingOpen] = useState(open);

  useEffect(() => {
    setIsVotingOpen(open);
  }, [open]);

  if (status === "during" && !category) return null;

  return (
    <>
      {status === "before" && <CountdownModal startDate={votingStart} />}

      {status === "during" && category && (
        <VotingModal
          category={category}
          isOpen={isVotingOpen}
          onClose={() => setIsVotingOpen(false)}
        />
      )}

      {status === "after" && <EndedModal />}
    </>
  );
}
