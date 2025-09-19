/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/categories";
import Vote from "@/models/votes";
import redis from "@/lib/redis";
import { rateLimiter } from "@/lib/rateLimiter";

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 30;

export async function GET(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("host") ||
      "unknown";

    if (rateLimiter) {
      try {
        await rateLimiter.consume(ip);
      } catch {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429 }
        );
      }
    }

    if (redis) {
      try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
          return NextResponse.json(JSON.parse(cached), {
            status: 200,
            headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
          });
        }
      } catch (cacheError) {
        console.warn("Redis cache error:", cacheError);
      }
    }

    await connectDB();

    const categories = await Category.find()
      .populate({
        path: "nominees",
        select: "_id name",
        options: { sort: { name: 1 } },
      })
      .lean({ virtuals: true });

    const categoriesWithVotes = await Promise.all(
      categories.map(async (category: any) => {
        const voteCounts = await Vote.aggregate([
          { $match: { category: category._id } },
          { $group: { _id: "$nominee", count: { $sum: 1 } } },
        ]);

        const voteMap: Record<string, number> = {};
        voteCounts.forEach((vc) => {
          voteMap[vc._id.toString()] = vc.count;
        });

        const nomineesWithVotes = (category.nominees || []).map((n: any) => ({
          _id: n._id,
          name: n.name,
          voteCount: voteMap[n._id.toString()] || 0,
        }));

        return { ...category, nominees: nomineesWithVotes };
      })
    );

    if (redis) {
      redis
        .set(CACHE_KEY, JSON.stringify(categoriesWithVotes), "EX", CACHE_TTL)
        .catch((err) => console.warn("Redis cache set failed:", err));
    }

    return NextResponse.json(categoriesWithVotes, {
      status: 200,
      headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
    });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
