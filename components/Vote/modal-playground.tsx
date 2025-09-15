"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import CountdownModal from "./countdown-modal";
import VotingModal from "./voting-modal";
import EndedModal from "./ended-modal";
import { useVotingStatus } from "@/hooks/useVotingStatus";

export default function ModalPlayground() {
  const [activeModal, setActiveModal] = useState<
    "countdown" | "voting" | "ended" | null
  >(null);
  const { status, votingStart } = useVotingStatus();

  const openModal = () => {
    if (status === "before") setActiveModal("countdown");
    else if (status === "during") setActiveModal("voting");
    else setActiveModal("ended");
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
        Modal Playground
      </h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          className="px-4 py-2 bg-[#ff7d1d] text-white rounded-lg hover:bg-[#e66c00] transition"
          onClick={openModal}
        >
          Open Modal Based on Voting Status
        </button>

        {/* Optional manual triggers */}
        <button
          className="px-4 py-2 bg-[#ff7d1d] text-white rounded-lg hover:bg-[#e66c00] transition"
          onClick={() => setActiveModal("countdown")}
        >
          Countdown Modal
        </button>

        <button
          className="px-4 py-2 bg-[#ff7d1d] text-white rounded-lg hover:bg-[#e66c00] transition"
          onClick={() => setActiveModal("voting")}
        >
          Voting Modal
        </button>

        <button
          className="px-4 py-2 bg-[#ff7d1d] text-white rounded-lg hover:bg-[#e66c00] transition"
          onClick={() => setActiveModal("ended")}
        >
          Ended Modal
        </button>
      </div>

      {/* Render modals */}
      {activeModal && (
        <Dialog open={true} onOpenChange={() => setActiveModal(null)}>
          {activeModal === "countdown" && (
            <CountdownModal startDate={votingStart} />
          )}
          {activeModal === "voting" && (
            <VotingModal onStartVoting={() => alert("Voting Started")} />
          )}
          {activeModal === "ended" && <EndedModal />}
        </Dialog>
      )}
    </div>
  );
}
