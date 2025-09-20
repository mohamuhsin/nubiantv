/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import SuspiciousAttempt from "@/models/suspiciousAttempt";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { rateLimiter } from "@/lib/rateLimiter"; // rate-limiter-flexible instance

export async function POST(req: Request) {
  await connectDB();

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { phone, nomineeId, categoryId, fingerprint, userAgent } =
    await req.json();

  if (!phone || !nomineeId || !categoryId || !fingerprint) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  // Parse and validate international phone number
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber?.isValid()) {
    return new Response(
      JSON.stringify({ error: "Invalid international phone number" }),
      { status: 400 }
    );
  }

  const e164Phone = phoneNumber.number; // E.164 format

  // Redis rate limiting
  if (rateLimiter) {
    try {
      await rateLimiter.consume(`${ip}:${e164Phone}`); // consume 1 point
    } catch {
      // Rate limit exceeded
      await SuspiciousAttempt.create({
        ip,
        phone: e164Phone,
        category: categoryId,
        fingerprint,
        userAgent,
        reason: "Rate limit exceeded",
      });
      return new Response(
        JSON.stringify({ error: "Too many requests, please try later" }),
        { status: 429 }
      );
    }
  }

  try {
    const vote = await Vote.create({
      phone: e164Phone,
      nominee: nomineeId,
      category: categoryId,
      fingerprint,
      ip,
      userAgent,
    });

    return new Response(JSON.stringify({ success: true, voteId: vote._id }), {
      status: 200,
    });
  } catch (err: any) {
    console.error("Vote submission error:", err);

    if (err.code === 11000) {
      return new Response(
        JSON.stringify({ error: "You have already voted in this category" }),
        { status: 409 }
      );
    }

    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
