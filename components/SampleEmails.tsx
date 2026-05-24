import React, { useState } from "react";

import { SAMPLE_EMAILS } from "../lib/sampleEmails";

interface SampleEmailsProps {
  onSelect: (body: string) => void;
  disabled?: boolean;
}

export const SampleEmails: React.FC<SampleEmailsProps> = ({ onSelect, disabled }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <details
      open={expanded}
      onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)}
      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
    >
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
        Try a sample email
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          ({SAMPLE_EMAILS.length} curated examples)
        </span>
      </summary>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 pb-4">
        {SAMPLE_EMAILS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelect(sample.body)}
            disabled={disabled}
            className="text-left p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {sample.label}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  sample.isPhishing
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }`}
              >
                {sample.isPhishing ? "phish" : "safe"}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {sample.description}
            </p>
          </button>
        ))}
      </div>
    </details>
  );
};
