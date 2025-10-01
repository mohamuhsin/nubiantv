"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Timer } from "lucide-react";

// ⏳ Countdown hook
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setFinished(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { ...timeLeft, finished };
}

export function AwardNotice() {
  const [visible, setVisible] = useState(true);
  const targetDate = new Date("2025-10-15T23:59:59");
  const { days, hours, minutes, seconds, finished } = useCountdown(targetDate);

  useEffect(() => {
    if (finished) setVisible(false);
  }, [finished]);

  const handleClose = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert
        className="relative flex flex-col items-center justify-center text-center gap-3 
                   border border-blue-400 bg-blue-50 text-blue-900 rounded-none px-4 sm:px-8 py-4 shadow-md"
      >
        {/* Icon + Text */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Timer className="h-6 w-6 text-blue-600" />
          <div>
            <AlertTitle className="font-bold text-base sm:text-lg">
              Nubian TV Awards 2025
            </AlertTitle>
            <AlertDescription className="text-sm sm:text-base">
              Ends on <strong>15th October 2025</strong> —{" "}
              <span className="font-mono font-bold text-base sm:text-lg">
                {days}d {hours}h {minutes}m {seconds}s
              </span>
            </AlertDescription>
          </div>
        </div>

        {/* Close button (centered under content on mobile, top-right on larger screens) */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close announcement"
          className="absolute right-3 top-3 text-blue-700 hover:text-blue-900 sm:static sm:mt-2"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </Alert>
    </div>
  );
}
