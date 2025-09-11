import Heading from "../components/Heading/heading";

export const metadata = {
  title: "Support & Services",
  description: "Explore the services we offer to the community.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="py-6">{/* <Navbar /> */}</header>

      {/* Hero Section */}
      <Heading
        title="Support & Services"
        description="Empowering the community with guidance and essential resources."
      />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <section className="py-14">{/* Page content goes here */}</section>
      </main>
    </div>
  );
}
