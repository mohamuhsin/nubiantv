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
  category: Category | null; // <-- pass category here
  onVoteSuccess?: () => void;
}

export default function VoteModal({
  open,
  onClose,
  category,
  onVoteSuccess,
}: VoteModalProps) {
  const { status, votingStart } = useVotingStatus();

  if (!category && status === "during") return null; // prevent error

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {status === "before" && <CountdownModal startDate={votingStart} />}
      {status === "during" && category && (
        <VotingModal
          category={category}
          isOpen={true}
          onClose={onClose}
          onVoteSuccess={onVoteSuccess}
        />
      )}
      {status === "after" && <EndedModal />}
    </Dialog>
  );
}
