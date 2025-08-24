import React, { useEffect, useState } from "react";

function TestApp() {
  const [chromeAvailable, setChromeAvailable] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Test if Chrome APIs are available
    console.log("Testing Chrome APIs...");
    console.log("chrome object:", typeof chrome);
    console.log("chrome.storage:", typeof chrome?.storage);

    if (chrome && chrome.storage) {
      setChromeAvailable(true);
      loadTestHighlights();
    } else {
      setError("Chrome extension APIs not available");
    }
  }, []);

  const loadTestHighlights = async () => {
    try {
      const result = await chrome.storage.local.get(["highlights"]);
      console.log("Storage result:", result);
      setHighlights(result.highlights || []);
    } catch (err) {
      console.error("Storage error:", err);
      setError(err.message);
    }
  };

  const addTestHighlight = async () => {
    try {
      const testHighlight = {
        id: Date.now().toString(),
        text: "Test highlight text",
        url: "https://example.com",
        title: "Test Page",
        timestamp: new Date().toISOString(),
        domain: "example.com",
      };

      const existing = await chrome.storage.local.get(["highlights"]);
      const highlights = existing.highlights || [];
      highlights.unshift(testHighlight);

      await chrome.storage.local.set({ highlights });
      setHighlights(highlights);
    } catch (err) {
      console.error("Error adding test highlight:", err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white">
      <h1 className="text-lg font-bold mb-4">Extension Test</h1>

      <div className="space-y-2 text-sm">
        <div>Chrome APIs Available: {chromeAvailable ? "✅" : "❌"}</div>
        <div>Highlights Count: {highlights.length}</div>
        {error && <div className="text-red-600">Error: {error}</div>}
      </div>

      <button
        onClick={addTestHighlight}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm"
        disabled={!chromeAvailable}
      >
        Add Test Highlight
      </button>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Highlights:</h2>
        {highlights.map((h) => (
          <div key={h.id} className="p-2 border rounded mb-2 text-xs">
            <div className="font-medium">{h.text}</div>
            <div className="text-gray-500">{h.domain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestApp;
