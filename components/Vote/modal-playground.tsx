"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import CountdownModal from "./countdown-modal";
import VotingModal from "./voting-modal";
import EndedModal from "./ended-modal";
import { useVotingStatus } from "@/hooks/useVotingStatus";

interface Nominee {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  nominees: Nominee[];
}

export default function ModalPlayground() {
  const [activeModal, setActiveModal] = useState<
    "countdown" | "voting" | "ended" | null
  >(null);
  const { status, votingStart } = useVotingStatus();

  // Sample category for testing VotingModal
  const sampleCategory: Category = {
    _id: "cat1",
    name: "Best Product",
    nominees: [
      { _id: "n1", name: "Nominee 1" },
      { _id: "n2", name: "Nominee 2" },
      { _id: "n3", name: "Nominee 3" },
    ],
  };

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
            <VotingModal
              category={sampleCategory}
              isOpen={true}
              onClose={() => setActiveModal(null)}
              onVoteSuccess={() => alert("Vote submitted successfully!")}
            />
          )}

          {activeModal === "ended" && <EndedModal />}
        </Dialog>
      )}
    </div>
  );
}
