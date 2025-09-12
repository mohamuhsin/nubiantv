import Hero from "@/components/Hero/hero";
import CEOMessage from "@/components/Ceo/ceo";
import SupportSection from "@/components/Donate/donate";
import PartnersSection from "@/components/Partners/partners";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* CEO Video Section */}
        <CEOMessage />

        {/* Support/Donation Section */}
        <SupportSection />

        {/* Partners Section */}
        <PartnersSection />
      </main>
    </div>
  );
}
