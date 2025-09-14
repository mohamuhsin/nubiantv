import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/categories";

dotenv.config();

const categories = [
  { name: "Best Nubian Event Award", image: "/nubiantv-awards.jpeg" },
  {
    name: "Best Nubian Tiktok Influencer Award",
    image: "/nubiantv-awards.jpeg",
  },
  {
    name: "Best Nubian Property Master Award",
    image: "/nubiantv-awards.jpeg",
  },
  { name: "Best Nubian Artist Award", image: "/nubiantv-awards.jpeg" },
  { name: "Best Nubian Song Award", image: "/nubiantv-awards.jpeg" },
  {
    name: "Best Nubian Social & Cultural Group Award",
    image: "/nubiantv-awards.jpeg",
  },
  { name: "Best Nubian Restaurant Award", image: "/nubiantv-awards.jpeg" },
  { name: "Most Viral Nubian Tiktoker Award", image: "/nubiantv-awards.jpeg" },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI not set in .env");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const category of categories) {
      await Category.findOneAndUpdate({ name: category.name }, category, {
        upsert: true,
        new: true,
      });
    }

    console.log("Categories seeding completed!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
