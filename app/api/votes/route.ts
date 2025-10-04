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

    // Votes today (since midnight)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const votesToday = await Vote.countDocuments({
      createdAt: { $gte: startOfToday },
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
