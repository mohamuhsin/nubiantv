/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CategoryModel from "@/models/categories";
import NomineeModel from "@/models/nominees";
import redis from "@/lib/redis";
import { rateLimiter } from "@/lib/rateLimiter";

// Ensure Nominee model is registered for Mongoose populate
void NomineeModel;

const CACHE_KEY = "categories_cache";
const CACHE_TTL = 30; // seconds

// Plain object types for lean query results
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

export async function GET(req: Request) {
  try {
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

    // Check Redis cache
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

    // Connect to MongoDB
    await connectDB();

    // Fetch categories and populate nominees (virtual voteCount included)
    const categories = await CategoryModel.find()
      .populate({
        path: "nominees",
        select: "_id name",
        options: { sort: { name: 1 } },
      })
      .lean({ virtuals: true });

    // Map to lean types and include voteCount
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

    // Cache result in Redis
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
