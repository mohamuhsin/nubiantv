import Hero from "./components/Hero/hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}
