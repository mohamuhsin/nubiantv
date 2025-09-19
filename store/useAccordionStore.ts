import { create } from "zustand";

interface AccordionStore {
  openCategoryId: string | null;
  setOpenCategory: (id: string | null) => void;
}

export const useAccordionStore = create<AccordionStore>((set) => ({
  openCategoryId: null,
  setOpenCategory: (id) => set({ openCategoryId: id }),
}));
