import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ClearErrors</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/playground"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Playground
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stop writing error-mapping code.
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Turn API errors into clean UI messages instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/playground"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Try Playground
            </Link>
            <a
              href="#how-it-works"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Example */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Before</span>
              <span className="text-gray-400 text-sm">After</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <pre className="text-red-400 text-sm overflow-x-auto">
{`{
  "error": "VALIDATION_ERROR",
  "field": "email",
  "message": "Invalid email format"
}`}
                </pre>
              </div>
              <div>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`{
  "message": "Please enter a valid email address",
  "severity": "error",
  "uiHint": "inline"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Normalize</h3>
              <p className="text-gray-600">
                Convert any backend error format into a standard shape
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Match Rules</h3>
              <p className="text-gray-600">
                Find the best matching rule or use AI fallback
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Display</h3>
              <p className="text-gray-600">
                Get user-friendly messages ready for your UI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <ul className="space-y-2 mb-6">
                <li>20 translations/day</li>
                <li>Default rules only</li>
                <li>English only</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-medium">
                Get Started
              </button>
            </div>
            <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white transform scale-105">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-4">$12<span className="text-lg">/mo</span></div>
              <ul className="space-y-2 mb-6">
                <li>Unlimited translations</li>
                <li>Custom rules</li>
                <li>Custom tone</li>
                <li>Multiple locales</li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100">
                Start Free Trial
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold mb-4">Team</h3>
              <div className="text-4xl font-bold mb-4">$39<span className="text-lg">/mo</span></div>
              <ul className="space-y-2 mb-6">
                <li>Everything in Pro</li>
                <li>Shared rule sets</li>
                <li>Versioned rules</li>
                <li>Team usage</li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-medium">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 ClearErrors. Built for developers who care about UX.</p>
        </div>
      </footer>
    </main>
  );
}

