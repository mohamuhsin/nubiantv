/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/categories";
import Vote from "@/models/votes";
import redis from "@/lib/redis";

const CACHE_TTL = 30;

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  await connectDB();

  try {
    if (redis) {
      const cached = await redis.get(`category:${id}`);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), {
          status: 200,
          headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
        });
      }
    }

    const category = await Category.findById(id)
      .populate({
        path: "nominees",
        select: "_id name",
      })
      .lean({ virtuals: true });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const voteCounts = await Vote.aggregate([
      { $match: { category: category._id } },
      { $group: { _id: "$nominee", count: { $sum: 1 } } },
    ]);

    const voteMap = voteCounts.reduce<Record<string, number>>((acc, vc) => {
      acc[vc._id.toString()] = vc.count;
      return acc;
    }, {});

    const nomineesWithVotes = (category.nominees || []).map((nominee: any) => ({
      ...nominee,
      voteCount: voteMap[nominee._id.toString()] || 0,
    }));

    const responseData = { ...category, nominees: nomineesWithVotes };

    if (redis) {
      redis
        .set(`category:${id}`, JSON.stringify(responseData), "EX", CACHE_TTL)
        .catch((err) => console.warn("Redis cache set failed:", err));
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
    });
  } catch (err) {
    console.error("Fetch category error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
