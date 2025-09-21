/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CategoryModel from "@/models/categories";
import NomineeModel from "@/models/nominees";
import { getRedis } from "@/lib/redis";
import { getRateLimiter } from "@/lib/rateLimiter";

void NomineeModel; // Ensure model registration

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 60; // 60 seconds

const redis = getRedis();
const rateLimiter = getRateLimiter("rl_categories", 100, 60);

interface NomineeLean {
  _id: string;
  name: string;
  voteCount: number;
}

interface CategoryLean {
  _id: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  nominees: NomineeLean[];
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("host") ||
    "unknown";

  // Rate limiting
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

  // Redis cache
  if (redis) {
    try {
      const cached = await redis.get(CACHE_KEY);
      if (cached) {
        return NextResponse.json(JSON.parse(cached) as CategoryLean[], {
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

  const categories = await CategoryModel.find()
    .populate({
      path: "nominees",
      select: "_id name",
      options: { sort: { name: 1 } },
    })
    .lean({ virtuals: true });

  const categoriesWithVotes: CategoryLean[] = categories.map(
    (category: any) => ({
      _id: category._id.toString(),
      name: category.name,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      nominees: (category.nominees || []).map((n: any) => ({
        _id: n._id.toString(),
        name: n.name,
        voteCount: n.voteCount || 0,
      })),
    })
  );

  if (redis) {
    redis
      .set(CACHE_KEY, JSON.stringify(categoriesWithVotes), "EX", CACHE_TTL)
      .catch((err) => {
        console.warn("Redis cache set failed:", err);
      });
  }

  return NextResponse.json(categoriesWithVotes, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
  });
}
