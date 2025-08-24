import React, { useEffect, useState } from "react";
import HighlightList from "./components/HighlightList";
import { isApiKeyConfigured } from "./config/api";
import {
  deleteHighlight,
  getHighlights,
  updateHighlight,
} from "./utils/storage";

function App() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();

    // Listen for new highlights from content script
    const messageListener = (message) => {
      if (message.type === "HIGHLIGHT_SAVED") {
        loadHighlights();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const loadHighlights = async () => {
    try {
      const highlightData = await getHighlights();
      setHighlights(highlightData);
    } catch (error) {
      console.error("Error loading highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHighlight = async (id) => {
    try {
      await deleteHighlight(id);
      setHighlights(highlights.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Error deleting highlight:", error);
    }
  };

  const handleUpdateHighlight = async (id, updates) => {
    try {
      await updateHighlight(id, updates);
      setHighlights(
        highlights.map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
    } catch (error) {
      console.error("Error updating highlight:", error);
    }
  };

  const clearAllHighlights = async () => {
    if (window.confirm("Are you sure you want to delete all highlights?")) {
      try {
        await chrome.storage.local.set({ highlights: [] });
        setHighlights([]);
      } catch (error) {
        console.error("Error clearing highlights:", error);
      }
    }
  };

  const highlightsWithSummaries = highlights.filter((h) => h.summary).length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V4a1 1 0 011-1h6a1 1 0 011 1v0M7 8h10M7 12h4m-4 4h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Highlight Save
              </h1>
              <p className="text-xs text-slate-500">
                Smart text collection & AI insights
              </p>
            </div>
          </div>

          {highlights.length > 0 && (
            <button
              onClick={clearAllHighlights}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700">
              {highlights.length} highlight{highlights.length !== 1 ? "s" : ""}
            </span>
          </div>

          {highlightsWithSummaries > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <svg
                className="w-3 h-3 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="text-xs font-medium text-purple-700">
                {highlightsWithSummaries} AI summarized
              </span>
            </div>
          )}
        </div>

        {/* API Key Status */}
        {!isApiKeyConfigured() && highlights.length > 0 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="text-xs font-medium text-amber-800 mb-1">
                  AI Features Disabled
                </p>
                <p className="text-xs text-amber-700">
                  Configure your OpenAI API key in{" "}
                  <code className="bg-amber-200 px-1 rounded">
                    src/config/api.js
                  </code>{" "}
                  to enable AI summaries.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 p-6">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-sm text-slate-600 mt-3 font-medium">
              Loading highlights...
            </p>
          </div>
        ) : highlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1-1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V4a1 1 0 011-1h6a1 1 0 011 1v0M7 8h10M7 12h4m-4 4h10"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-2">
              No highlight yet
            </h3>
            <p className="text-sm text-slate-500 mb-3 max-w-48">
              Start collecting insights by selecting text on any webpage
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Select text → Right-click → Save highlight</span>
            </div>
          </div>
        ) : (
          <HighlightList
            highlights={highlights}
            onDelete={handleDeleteHighlight}
            onUpdate={handleUpdateHighlight}
          />
        )}
      </div>
    </div>
  );
}

export default App;
