/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { randomUUID, createHmac } from "crypto";
import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import SuspiciousAttempt from "@/models/suspiciousAttempt";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getRateLimiter } from "@/lib/rateLimiter";

interface VoteRequestBody {
  phone: string;
  nomineeId: string;
  categoryId: string;
  deviceHash?: string; // client-sent fingerprint
  userAgent?: string;
}

const rateLimiter = getRateLimiter("rl_votes", 30, 60);
const COOKIE_MAX_AGE = 20 * 24 * 60 * 60; // 20 days in seconds
const DEVICE_HMAC_KEY = process.env.DEVICE_HMAC_KEY || "replace-this-secret";

function hmacFingerprint(clientHash: string): string {
  return createHmac("sha256", DEVICE_HMAC_KEY).update(clientHash).digest("hex");
}

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

  // ✅ Normalize phone number
  const phoneNumber = parsePhoneNumberFromString(phone, "UG");
  if (!phoneNumber?.isValid()) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }
  const e164Phone = phoneNumber.number; // e.g. +256701234567

  // ✅ Sanitize & re-hash fingerprint
  const cleanedDeviceHash =
    typeof deviceHash === "string" && deviceHash.trim() !== ""
      ? hmacFingerprint(deviceHash.trim().slice(0, 128))
      : undefined;

  const cleanedUserAgent =
    typeof userAgent === "string" && userAgent.trim() !== ""
      ? userAgent.trim().slice(0, 512)
      : req.headers.get("user-agent") ?? undefined;

  // ✅ Rate limiting
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
    // 🧠 1️⃣ Prevent duplicate phone votes
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

    // 🧠 2️⃣ Prevent duplicate device votes (by fingerprint)
    if (cleanedDeviceHash) {
      const existingDeviceVote = await Vote.findOne({
        deviceHash: cleanedDeviceHash,
        category: categoryId,
      });

      if (existingDeviceVote) {
        await SuspiciousAttempt.create({
          ip,
          phone: e164Phone,
          category: categoryId,
          deviceHash: cleanedDeviceHash,
          userAgent: cleanedUserAgent,
          reason: "Fingerprint already voted",
        });
        return NextResponse.json(
          { error: "This device has already voted in this category" },
          { status: 409 }
        );
      }
    }

    // 🧠 3️⃣ Device session (cookie) check
    const existingDeviceSession = req.cookies.get("device_session")?.value;
    if (existingDeviceSession) {
      const existingBySession = await Vote.findOne({
        deviceSession: existingDeviceSession,
        category: categoryId,
      });
      if (existingBySession) {
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

    // ✅ Generate/reuse session token
    const deviceSession = existingDeviceSession || randomUUID();

    // ✅ Save the vote
    const vote = await Vote.create({
      phone: e164Phone,
      nominee: nomineeId,
      category: categoryId,
      deviceSession,
      deviceHash: cleanedDeviceHash,
      ip,
      userAgent: cleanedUserAgent,
    });

    // ✅ Return success + session cookie
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
  } catch (err: any) {
    console.error("❌ Vote submission error:", err);

    if (err?.code === 11000) {
      const key = err.keyValue || {};
      if (key.deviceSession || key.deviceHash) {
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
