import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/categories";
import Nominee from "@/models/nominees";
import Vote from "@/models/votes";
import redis from "@/lib/redis";
import { rateLimiter } from "@/lib/rateLimiter";

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 30; // seconds

export async function GET(req: Request) {
  try {
    // --- 1. Get client IP for rate limiting ---
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("host") ||
      "unknown";

    // --- 2. Apply rate limiting ---
    try {
      await rateLimiter.consume(ip); // consume 1 point per request
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // --- 3. Try fetching cached data from Redis ---
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
      // Continue without failing the request
    }

    // --- 4. Connect to MongoDB ---
    await connectDB();

    // --- 5. Fetch categories from MongoDB ---
    const categories = await Category.find({}).lean();

    // --- 6. Fetch nominees and vote counts for each category ---
    const categoriesWithNominees = await Promise.all(
      categories.map(async (category) => {
        const nominees = await Nominee.find({ category: category._id }).lean();

        const voteCounts = await Vote.aggregate([
          { $match: { category: category._id } },
          { $group: { _id: "$nominee", count: { $sum: 1 } } },
        ]);

        const voteMap: Record<string, number> = {};
        voteCounts.forEach((vc) => {
          voteMap[vc._id.toString()] = vc.count;
        });

        const nomineesWithVotes = nominees
          .map((n) => ({
            _id: n._id,
            name: n.name,
            voteCount: voteMap[n._id.toString()] || 0,
          }))
          .sort((a, b) => b.voteCount - a.voteCount);

        return {
          _id: category._id,
          name: category.name,
          image: category.image,
          nominees: nomineesWithVotes,
        };
      })
    );

    // --- 7. Cache result in Redis (ignore cache errors) ---
    redis
      .set(CACHE_KEY, JSON.stringify(categoriesWithNominees), "EX", CACHE_TTL)
      .catch((err) => {
        console.warn("Redis cache set failed:", err);
      });

    // --- 8. Return response ---
    return NextResponse.json(categoriesWithNominees, {
      status: 200,
      headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
    });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
