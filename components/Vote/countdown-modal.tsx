"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownModalProps {
  startDate: Date;
}

export default function CountdownModal({ startDate }: CountdownModalProps) {
  const { days, hours, minutes, seconds } = useCountdown(startDate);

  const countdownItems = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center">
      <DialogHeader className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
        <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Get Ready To Vote
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base md:text-lg text-muted-foreground">
          Voting starts on{" "}
          <span className="text-[#ff7d1d] font-semibold">
            {startDate.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </DialogDescription>
      </DialogHeader>

      {/* Countdown container */}
      <div className="flex overflow-x-auto gap-3 sm:gap-6 py-6 w-full justify-center">
        {countdownItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-muted/20 border border-[#ff7d1d]/50 min-w-[60px] sm:min-w-[70px] md:min-w-[80px]"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#ff7d1d]">
              {item.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
