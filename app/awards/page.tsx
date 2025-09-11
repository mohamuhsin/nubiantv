import Heading from "../components/Heading/heading";

export const metadata = {
  title: "Awards",
  description: "Celebrating excellence within our community.",
};

export default function AwardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Nubian TV Awards"
        description="Celebrating excellence in our community."
      />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="py-14">{/* Page content goes here */}</section>
      </main>
    </div>
  );
}
