import { create } from "zustand";

interface AccordionState {
  openIndex: number | null; // currently open accordion index
  setOpenIndex: (index: number | null) => void; // function to update openIndex
}

export const useAccordionStore = create<AccordionState>((set) => ({
  openIndex: null, // default: no accordion is open
  setOpenIndex: (index) => set({ openIndex: index }),
}));
