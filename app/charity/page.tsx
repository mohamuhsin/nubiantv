import Heading from "@/components/Heading/heading";

export const metadata = {
  title: "charity",
  description: "Making a difference through giving and support.",
};

export default function CharityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Doors of Sadaqah"
        description="Give back and make an impact."
      />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="py-14">{/* Page content goes here */}</section>
      </main>
    </div>
  );
}
