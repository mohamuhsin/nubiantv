"use client";

import { Dialog } from "@/components/ui/dialog";
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

export default function VoteModal({ open, onClose, category }: VoteModalProps) {
  const { status, votingStart } = useVotingStatus();

  // Nothing to render if voting is during but no category is selected
  if (status === "during" && !category) return null;

  return (
    <>
      {/* Countdown before voting */}
      {status === "before" && (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <CountdownModal startDate={votingStart} />
        </Dialog>
      )}

      {/* Voting is live */}
      {status === "during" && category && (
        <VotingModal category={category} isOpen={open} onClose={onClose} />
      )}

      {/* Voting ended */}
      {status === "after" && (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <EndedModal />
        </Dialog>
      )}
    </>
  );
}
