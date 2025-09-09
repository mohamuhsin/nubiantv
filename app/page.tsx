import Hero from "./components/Hero/hero";
import CEOMessage from "./components/Ceo/ceo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />

        {/* CEO Video Section */}
        <CEOMessage />
      </main>
    </div>
  );
}
