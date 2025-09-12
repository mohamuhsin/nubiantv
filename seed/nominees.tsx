import mongoose from "mongoose";
import dotenv from "dotenv";
import Nominee from "@/models/nominees";
import Category from "@/models/categories";

dotenv.config();

const nomineesByCategory: Record<string, string[]> = {
  "Travel Agency Excellence Award": [
    "Weli Travel",
    "Maqam Travel",
    "Tawakal Travel Ltd",
    "Al-Misbaahu Travel Agency",
    "Al Hashimiyah Hijja and Ummrah",
  ],
  "Agri Based Products Excellence Award": [
    "Supreme Flour",
    "Maganjo",
    "Kaswa",
    "Hamza Millers",
  ],
  "Telecom Excellence Award": [
    "MTN Uganda",
    "Airtel Uganda",
    "Uganda Telecom",
    "Salaam Telecom",
    "Lyca Mobile",
  ],
  // ... add the rest of your categories and nominees
};

async function seedNominees() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    for (const [categoryName, nominees] of Object.entries(nomineesByCategory)) {
      const category = await Category.findOne({ name: categoryName });

      if (!category) {
        console.warn(`⚠️ Category not found: ${categoryName}. Skipping...`);
        continue;
      }

      for (const name of nominees) {
        await Nominee.findOneAndUpdate(
          { name },
          { name, category: category._id },
          { upsert: true, new: true }
        );
      }

      console.log(`✅ Seeded nominees for category: ${categoryName}`);
    }

    console.log("🎉 All nominees seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedNominees();
