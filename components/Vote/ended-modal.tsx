"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function EndedModal() {
  return (
    <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center">
      <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
        <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Voting Ended
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Voting has ended.{" "}
          <span className="text-[#ff7d1d] font-semibold">🎉 Thank you!</span>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-6 w-full"></div>
    </DialogContent>
  );
}
