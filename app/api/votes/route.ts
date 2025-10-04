import { connectDB } from "@/lib/db";
import Vote from "@/models/votes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const totalVotes = await Vote.countDocuments();
    const uniqueVoters = await Vote.distinct("phone").then(
      (phones) => phones.length
    );
    const votes = await Vote.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ totalVotes, uniqueVoters, votes });
  } catch (err) {
    console.error("❌ Error fetching votes:", err);
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}
