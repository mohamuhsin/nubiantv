/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/categories";
import Vote from "@/models/votes";
import redis from "@/lib/redis";

const CACHE_TTL = 30; // seconds

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // destructured correctly
) {
  const { id } = params;

  await connectDB();

  try {
    // 1️⃣ Try Redis cache first
    if (redis) {
      const cached = await redis.get(`category:${id}`);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), {
          status: 200,
          headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
        });
      }
    }

    // 2️⃣ Fetch category with nominees
    const category = await Category.findById(id)
      .populate({ path: "nominees", select: "_id name" }) // populate virtual
      .lean({ virtuals: true });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Aggregate votes per nominee
    const voteCounts = await Vote.aggregate([
      { $match: { category: category._id } },
      { $group: { _id: "$nominee", count: { $sum: 1 } } },
    ]);

    const voteMap: Record<string, number> = {};
    voteCounts.forEach((vc) => {
      voteMap[vc._id.toString()] = vc.count;
    });

    // 4️⃣ Merge vote counts into nominees
    const nomineesWithVotes = (category.nominees || []).map((nominee: any) => ({
      ...nominee,
      voteCount: voteMap[nominee._id.toString()] || 0,
    }));

    const responseData = { ...category, nominees: nomineesWithVotes };

    // 5️⃣ Cache in Redis
    if (redis) {
      redis
        .set(`category:${id}`, JSON.stringify(responseData), "EX", CACHE_TTL)
        .catch((err) => console.warn("Redis cache set failed:", err));
    }

    // 6️⃣ Return JSON response
    return NextResponse.json(responseData, {
      status: 200,
      headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
    });
  } catch (err) {
    console.error("Fetch category error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
