'use client';

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Custom Rules</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">
            Custom rules management coming soon. This will allow you to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Create custom error translation rules</li>
            <li>Match errors by code, field, or status</li>
            <li>Define custom user-friendly messages</li>
            <li>Set severity and UI hints</li>
            <li>Version and share rules with your team</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

