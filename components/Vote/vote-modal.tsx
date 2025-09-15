"use client";

import { Dialog } from "@/components/ui/dialog";
import { useVotingStatus } from "@/hooks/useVotingStatus";
import CountdownModal from "./countdown-modal";
import VotingModal from "./voting-modal";
import EndedModal from "./ended-modal";

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  onStartVoting?: () => void;
}

export default function VoteModal({
  open,
  onClose,
  onStartVoting,
}: VoteModalProps) {
  const { status, votingStart } = useVotingStatus();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {status === "before" && <CountdownModal startDate={votingStart} />}
      {status === "during" && <VotingModal onStartVoting={onStartVoting} />}
      {status === "after" && <EndedModal />}
    </Dialog>
  );
}
