import mongoose from "mongoose";
import dotenv from "dotenv";
import Nominee from "../models/nominees";
import Category from "../models/categories";

dotenv.config();

const nomineesByCategory: Record<string, string[]> = {
  "Best Nubian Event Award": [
    "Sabala Night",
    "Nubian Festival",
    "Nubian Night",
    "Family day out Event",
  ],

  "Best Nubian Tiktok Influencer Award": [
    "Aisha Amar",
    "Mimi Salmin",
    "Naima Isa",
  ],

  "Best Nubian Property Master Award": [
    "Kakande Properties",
    "Noah Sebbi Property Agency",
    "Ahmed Property Masters",
  ],

  "Best Nubian Artist Award": [
    "Amina Bojo",
    "Mad Fire",
    "Jab Jay",
    "Risan Romeo",
    "Ramos Yusuf",
    "Official Brady",
  ],

  "Best Nubian Song Award": [
    "“Mama” – Mad Fire",
    "“Kungu ta Waze” – Amina Bojo",
    "“Chai te Naku” – Jab Jay",
    "“Mahaba” – Brady",
    "“Binia Nubi” – Ramos Yusuf",
    "“Abuya” – Risan Romeo",
  ],

  "Best Nubian Social & Cultural Group Award": [
    "Satellite Social Club",
    "Yal Hamam",
    "Nukra",
    "Sister Club",
    "Sumuku Nubian Heritage",
    "Amara Faga",
    "Nubi Wafaka",
  ],

  "Best Nubian Restaurant Award": [
    "Mama Abdu's Restaurant",
    "Minallah Restaurant",
    "City Foods",
    "Devon Foods",
    "Power House",
  ],

  "Most Viral Nubian Tiktoker Award": [
    "Chifleba",
    "Nubian King Tangoun",
    "Awa Rafah",
    "Shifah Capa Cat",
    "Waslat Shubra",
    "Mr Ibu Arua",
    "Supermum",
  ],
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
