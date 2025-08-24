import React, { useState } from "react";
import { isApiKeyConfigured } from "../config/api";
import { generateSummary } from "../services/openai";

function HighlightItem({ highlight, onDelete, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const openUrl = () => {
    chrome.tabs.create({ url: highlight.url });
  };

  const handleGenerateSummary = async () => {
    if (!isApiKeyConfigured()) {
      alert("Please configure your OpenAI API key in src/config/api.js");
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(highlight.text, highlight.domain);
      const updatedHighlight = { ...highlight, summary };
      onUpdate(highlight.id, { summary });
      setShowSummary(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      alert(`Failed to generate summary: ${error.message}`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:border-slate-300/60 hover:bg-white/90">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {highlight.title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
              />
            </svg>
            <p className="text-xs text-slate-500 truncate">
              {highlight.domain}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(highlight.id)}
          className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          title="Delete highlight"
        >
          <svg
            className="w-4 h-4"
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
        </button>
      </div>

      {/* Highlight Text */}
      <div className="mb-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            "{isExpanded ? highlight.text : truncateText(highlight.text)}"
          </p>
        </div>
        {highlight.text.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium flex items-center gap-1"
          >
            {isExpanded ? (
              <>
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
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Show less
              </>
            ) : (
              <>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* AI Summary Section */}
      {highlight.summary && (
        <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200/60">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-800 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3 text-white"
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
              </div>
              AI Summary
            </h4>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium bg-white/60 px-2 py-1 rounded-full transition-colors"
            >
              {showSummary ? (
                <>
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
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Hide
                </>
              ) : (
                <>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Show
                </>
              )}
            </button>
          </div>
          {showSummary && (
            <div className="bg-white/70 p-3 rounded-lg border border-purple-100">
              <p className="text-sm text-slate-700 leading-relaxed">
                {highlight.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Summary Button */}
      {!highlight.summary && isApiKeyConfigured() && (
        <div className="mb-4">
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isGeneratingSummary ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating AI Summary...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
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
                Generate AI Summary
              </>
            )}
          </button>
        </div>
      )}

      {/* Show button even if API key not configured */}
      {!highlight.summary && !isApiKeyConfigured() && (
        <div className="mb-4">
          <button
            onClick={() =>
              alert("Please configure your OpenAI API key in src/config/api.js")
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 border border-slate-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Generate AI Summary (API Key Required)
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDate(highlight.timestamp)}</span>
        </div>
        <button
          onClick={openUrl}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-all duration-200"
        >
          <span>Visit page</span>
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HighlightItem;
