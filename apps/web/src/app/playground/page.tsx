'use client';

import { useState } from 'react';
import { clearError, normalizeError } from '@ahmedsherwani/clearerrors-core';
import type { TranslatedError } from '@ahmedsherwani/clearerrors-core';

export default function PlaygroundPage() {
  const [inputError, setInputError] = useState(`{
  "error": "VALIDATION_ERROR",
  "field": "email",
  "message": "Invalid email format"
}`);
  const [translated, setTranslated] = useState<TranslatedError | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    setTranslated(null);

    try {
      const parsedError = JSON.parse(inputError);
      const result = await clearError(parsedError);
      setTranslated(result);
    } catch (err: any) {
      setError(err.message || 'Failed to translate error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (translated) {
      navigator.clipboard.writeText(JSON.stringify(translated, null, 2));
    }
  };

  const exampleErrors = [
    {
      name: 'Validation Error',
      error: {
        error: 'VALIDATION_ERROR',
        field: 'email',
        message: 'Invalid email format',
      },
    },
    {
      name: 'Unauthorized',
      error: {
        status: 401,
        error: 'UNAUTHORIZED',
      },
    },
    {
      name: 'Not Found',
      error: {
        status: 404,
        error: 'NOT_FOUND',
        message: 'User not found',
      },
    },
    {
      name: 'Server Error',
      error: {
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
      },
    },
    {
      name: 'Rate Limit',
      error: {
        status: 429,
        error: 'RATE_LIMIT_EXCEEDED',
      },
    },
  ];

  const loadExample = (example: any) => {
    setInputError(JSON.stringify(example.error, null, 2));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Playground</h1>
          <p className="text-gray-600">
            Paste your API error and see it transformed into a user-friendly message
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Input Error</h2>
              <div className="flex space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const example = exampleErrors.find((ex) => ex.name === e.target.value);
                      if (example) loadExample(example);
                      e.target.value = '';
                    }
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Load Example</option>
                  {exampleErrors.map((ex) => (
                    <option key={ex.name} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              value={inputError}
              onChange={(e) => setInputError(e.target.value)}
              className="w-full h-64 font-mono text-sm border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your API error JSON here..."
            />
            <button
              onClick={handleTranslate}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Translating...' : 'Translate Error'}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Translated Output</h2>
              {translated && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Copy
                </button>
              )}
            </div>
            {translated ? (
              <div className="space-y-4">
                <div className="font-mono text-sm bg-gray-50 p-4 rounded border border-gray-200">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(translated, null, 2)}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Message:</span>
                    <p className="text-gray-900 mt-1">{translated.message}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Severity:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        translated.severity === 'error' ? 'bg-red-100 text-red-800' :
                        translated.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {translated.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">UI Hint:</span>
                      <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {translated.uiHint}
                      </span>
                    </div>
                    {translated.action && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Action:</span>
                        <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {translated.action}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded">
                Translated output will appear here
              </div>
            )}
          </div>
        </div>

        {/* Normalized Error Preview */}
        {translated && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Normalized Error (Intermediate Step)</h2>
            <div className="font-mono text-sm bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(normalizeError(JSON.parse(inputError)), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

