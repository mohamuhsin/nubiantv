/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/submit-vote/route.ts (or wherever your route lives)
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import SuspiciousAttempt from "@/models/suspiciousAttempt";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getRateLimiter } from "@/lib/rateLimiter";

interface VoteRequestBody {
  phone: string;
  nomineeId: string;
  categoryId: string;
  deviceHash?: string;
  userAgent?: string;
}

const rateLimiter = getRateLimiter("rl_votes", 30, 60);

// 20 days in seconds
const COOKIE_MAX_AGE = 20 * 24 * 60 * 60; // 1,728,000

export async function POST(req: NextRequest) {
  await connectDB();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const body: VoteRequestBody = await req.json();
  const { phone, nomineeId, categoryId, deviceHash, userAgent } = body;

  if (!phone || !nomineeId || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate and normalize phone number (always +256 format)
  const phoneNumber = parsePhoneNumberFromString(phone, "UG");
  if (!phoneNumber?.isValid()) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }
  const e164Phone = phoneNumber.number; // e.g. +256701234567

  // sanitize deviceHash (trim + limit length)
  const cleanedDeviceHash =
    typeof deviceHash === "string" && deviceHash.trim() !== ""
      ? deviceHash.trim().slice(0, 128)
      : undefined;

  // sanitize userAgent (optional)
  const cleanedUserAgent =
    typeof userAgent === "string" && userAgent.trim() !== ""
      ? userAgent.trim().slice(0, 512)
      : req.headers.get("user-agent") ?? undefined;

  // Rate limit by IP + phone
  if (rateLimiter) {
    try {
      await rateLimiter.consume(`${ip}:${e164Phone}`);
    } catch {
      await SuspiciousAttempt.create({
        ip,
        phone: e164Phone,
        category: categoryId,
        deviceHash: cleanedDeviceHash,
        userAgent: cleanedUserAgent,
        reason: "Rate limit exceeded",
      });
      return NextResponse.json(
        { error: "Too many requests, try later" },
        { status: 429 }
      );
    }
  }

  try {
    // Soft check (for safety, even with unique index)
    const existingVote = await Vote.findOne({
      phone: e164Phone,
      category: categoryId,
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this category" },
        { status: 409 }
      );
    }

    // DEVICE SESSION: read existing cookie if present
    const existingDeviceSession = req.cookies.get("device_session")?.value;

    // If cookie present, enforce device-session uniqueness (DB will also enforce via index)
    if (existingDeviceSession) {
      const existingByDevice = await Vote.findOne({
        deviceSession: existingDeviceSession,
        category: categoryId,
      });
      if (existingByDevice) {
        // Log suspicious attempt and reject
        await SuspiciousAttempt.create({
          ip,
          phone: e164Phone,
          category: categoryId,
          deviceHash: cleanedDeviceHash,
          userAgent: cleanedUserAgent,
          reason: "Device session already voted",
        });

        return NextResponse.json(
          { error: "This device has already voted in this category" },
          { status: 409 }
        );
      }
    }

    // generate or reuse deviceSession token (we'll set cookie in response)
    const deviceSession = existingDeviceSession || randomUUID();

    // Create new vote and save deviceSession + deviceHash for correlation
    const vote = await Vote.create({
      phone: e164Phone,
      nominee: nomineeId,
      category: categoryId,
      deviceSession,
      deviceHash: cleanedDeviceHash,
      ip,
      userAgent: cleanedUserAgent,
    });

    // Build response and set device_session cookie (HttpOnly) for 20 days
    const res = NextResponse.json(
      { success: true, voteId: vote._id },
      { status: 200 }
    );
    res.cookies.set("device_session", deviceSession, {
      httpOnly: true,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: unknown) {
    console.error("❌ Vote submission error:", err);

    const e = err as any;

    // Database duplicate safeguard (covers race conditions / index conflicts)
    // Could be phone+category or deviceSession+category unique index error
    if (e?.code === 11000) {
      console.warn(
        "Duplicate key error on vote insert:",
        e.keyValue || e.keyPattern || e
      );
      // Try to provide a helpful message depending on index key (best-effort)
      const key = e.keyValue || {};
      if (key.deviceSession) {
        return NextResponse.json(
          { error: "This device has already voted in this category" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "You have already voted in this category" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
