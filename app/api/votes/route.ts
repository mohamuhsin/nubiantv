import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 🕛 Extract query params
    const url = new URL(req.url);
    const timezone = url.searchParams.get("timezone") || "Africa/Kampala";
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(parseInt(limitParam || "50", 10), 200);

    // 🧮 Total votes
    const totalVotes = await Vote.countDocuments();

    // 👥 Unique voters
    const uniqueVoters = await Vote.distinct("phone").then(
      (phones) => phones.length
    );

    // 🕐 Midnight in user’s timezone
    const startOfToday = moment.tz(timezone).startOf("day").toDate();

    const votesToday = await Vote.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // 🧾 Recent votes (for admin view or debugging)
    const recentVotes = await Vote.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const responseData = {
      totalVotes,
      uniqueVoters,
      votesToday,
      timezone,
      recentVotes,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=15, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    console.error("❌ Error fetching vote summary:", err);
    return NextResponse.json(
      { error: "Failed to fetch vote summary" },
      { status: 500 }
    );
  }
}
