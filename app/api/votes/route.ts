import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Total votes (all time)
    const totalVotes = await Vote.countDocuments();

    // Unique voters (distinct phone numbers)
    const uniqueVoters = await Vote.distinct("phone").then(
      (phones) => phones.length
    );

    // Votes today (midnight UTC)
    const now = new Date();
    const startOfTodayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const votesToday = await Vote.countDocuments({
      createdAt: { $gte: startOfTodayUTC },
    });

    // Recent votes (for debugging/UI if needed)
    const votes = await Vote.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({
      totalVotes,
      uniqueVoters,
      votesToday,
      votes,
    });
  } catch (err) {
    console.error("❌ Error fetching votes:", err);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}
