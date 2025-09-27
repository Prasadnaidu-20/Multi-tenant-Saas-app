import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Multi-Tenant Notes SaaS</h1>
          <p className="text-xl mb-8">
            Secure, multi-tenant notes for your team. Keep your company’s data private and organized.
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-blue-800 text-white font-semibold px-6 py-3 rounded shadow hover:bg-blue-900 transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">Tenant Isolation</h3>
              <p>Your company’s data is private and secure, isolated from other tenants.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">Role-Based Access</h3>
              <p>Admins manage users and subscriptions; members manage notes.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">Subscription Plans</h3>
              <p>Free plan allows 3 notes; Pro plan provides unlimited notes per tenant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">1. Login</h3>
              <p>Use your company account to log in securely.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">2. Create & Manage Notes</h3>
              <p>Add, edit, and organize your notes while keeping them private to your tenant.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded shadow">
              <h3 className="font-semibold text-xl mb-2">3. Upgrade to Pro</h3>
              <p>Free plan limits 3 notes; upgrade to Pro for unlimited note creation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Multi-Tenant Notes SaaS. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Docs</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
