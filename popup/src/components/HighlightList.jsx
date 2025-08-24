import React from "react";
import HighlightItem from "./HighlightItem";

function HighlightList({ highlights, onDelete, onUpdate }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {highlights.map((highlight, index) => (
          <div key={highlight.id} className="relative">
            <HighlightItem
              highlight={highlight}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
            {index < highlights.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighlightList;
