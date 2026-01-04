'use client';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">
            Dashboard coming soon. This will include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Usage statistics</li>
            <li>Custom rules management</li>
            <li>API key management</li>
            <li>Subscription management</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

