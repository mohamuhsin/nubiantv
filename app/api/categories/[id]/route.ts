/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CategoryModel from "@/models/categories";
import VoteModel from "@/models/votes";
import NomineeModel from "@/models/nominees";
import { getRedis } from "@/lib/redis";
import { getRateLimiter } from "@/lib/rateLimiter";

void NomineeModel; // ensure model registration

const CACHE_TTL = 30; // seconds
const redis = getRedis();
const rateLimiter = getRateLimiter("rl_category", 50, 60); // 50 requests per minute

interface NomineeLean {
  _id: string;
  name: string;
  voteCount: number;
}

interface CategoryLean {
  _id: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  nominees: NomineeLean[];
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").filter(Boolean).pop();

  if (!id) {
    return NextResponse.json(
      { error: "Category ID required" },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("host") ||
    "unknown";

  // Rate limit
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

  const cacheKey = `category:${id}`;

  // Redis cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached) as CategoryLean, {
          status: 200,
          headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
        });
      }
    } catch (err) {
      console.warn("Redis cache error:", err);
    }
  }

  // Fetch from DB
  await connectDB();

  const category = await CategoryModel.findById(id)
    .populate({ path: "nominees", select: "_id name" })
    .lean({ virtuals: true });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Aggregate votes
  const voteCounts = await VoteModel.aggregate([
    { $match: { category: category._id } },
    { $group: { _id: "$nominee", count: { $sum: 1 } } },
  ]);

  const voteMap = voteCounts.reduce<Record<string, number>>((acc, v) => {
    acc[v._id.toString()] = v.count;
    return acc;
  }, {});

  const nomineesWithVotes: NomineeLean[] = (category.nominees || []).map(
    (n: any) => ({
      _id: n._id.toString(),
      name: n.name,
      voteCount: voteMap[n._id.toString()] || 0,
    })
  );

  const responseData: CategoryLean = {
    _id: category._id.toString(),
    name: category.name,
    image: category.image,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    nominees: nomineesWithVotes,
  };

  // Save to Redis
  if (redis) {
    redis
      .set(cacheKey, JSON.stringify(responseData), "EX", CACHE_TTL)
      .catch((err) => console.warn("Redis cache set failed:", err));
  }

  return NextResponse.json(responseData, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
  });
}
