import Heading from "@/components/Heading/heading";

export const metadata = {
  title: "Events",
  description:
    "Stay updated with our latest events, programs, and community activities.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Upcoming Events"
        description="Discover inspiring events near you."
      />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="py-14">{/* Page content goes here */}</section>
      </main>
    </div>
  );
}
