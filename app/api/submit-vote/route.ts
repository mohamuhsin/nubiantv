/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import SuspiciousAttempt from "@/models/suspiciousAttempt";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getRateLimiter } from "@/lib/rateLimiter";

interface VoteRequestBody {
  phone: string;
  nomineeId: string;
  categoryId: string;
  fingerprint?: string;
  userAgent?: string;
}

const rateLimiter = getRateLimiter("rl_votes", 30, 60);

export async function POST(req: NextRequest) {
  await connectDB();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const body: VoteRequestBody = await req.json();
  const { phone, nomineeId, categoryId, fingerprint, userAgent } = body;

  if (!phone || !nomineeId || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Validate and normalize phone number (always +256 format)
  const phoneNumber = parsePhoneNumberFromString(phone, "UG");
  if (!phoneNumber?.isValid()) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }
  const e164Phone = phoneNumber.number; // e.g. +256701234567

  // ✅ Clean fingerprint to avoid "undefined"/"null" strings
  const safeFingerprint =
    fingerprint &&
    fingerprint !== "undefined" &&
    fingerprint !== "null" &&
    fingerprint.trim() !== ""
      ? fingerprint
      : undefined;

  // ✅ Rate limit by IP + phone
  if (rateLimiter) {
    try {
      await rateLimiter.consume(`${ip}:${e164Phone}`);
    } catch {
      await SuspiciousAttempt.create({
        ip,
        phone: e164Phone,
        category: categoryId,
        fingerprint: safeFingerprint,
        userAgent,
        reason: "Rate limit exceeded",
      });
      return NextResponse.json(
        { error: "Too many requests, try later" },
        { status: 429 }
      );
    }
  }

  try {
    // ✅ Soft duplicate check (by phone OR fingerprint)
    const existingVote = await Vote.findOne({
      category: categoryId,
      $or: [{ phone: e164Phone }, { fingerprint: safeFingerprint }],
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this category" },
        { status: 409 }
      );
    }

    // ✅ Create the new vote
    const vote = await Vote.create({
      phone: e164Phone,
      nominee: nomineeId,
      category: categoryId,
      fingerprint: safeFingerprint,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, voteId: vote._id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Vote submission error:", err);

    // MongoDB duplicate key safeguard (shouldn’t occur now)
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "You have already voted in this category" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
