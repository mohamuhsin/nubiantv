"use client";

import { useEffect, useState } from "react";

// Voting dates in local time
export const VOTING_START_LOCAL = new Date(2025, 9, 1, 0, 0, 0); // 1 Oct 2025, 00:00 local
export const VOTING_END_LOCAL = new Date(2025, 9, 15, 23, 59, 59); // 31 Oct 2025, 23:59 local

export type VotingStatus = "before" | "during" | "after";

/**
 * Hook to get the current voting status based on local time
 */
export function useVotingStatus(): {
  status: VotingStatus;
  votingStart: Date;
  votingEnd: Date;
} {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  let status: VotingStatus = "before";
  const nowMs = now.getTime();

  if (nowMs < VOTING_START_LOCAL.getTime()) {
    status = "before";
  } else if (nowMs <= VOTING_END_LOCAL.getTime()) {
    status = "during";
  } else {
    status = "after";
  }

  return {
    status,
    votingStart: VOTING_START_LOCAL,
    votingEnd: VOTING_END_LOCAL,
  };
}
