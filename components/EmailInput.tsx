import React from "react";

import { getLengthMeter, MAX_EMAIL_LENGTH } from "../lib/validation";

import { LoaderIcon, SparklesIcon } from "./icons";

interface EmailInputProps {
  emailText: string;
  setEmailText: (text: string) => void;
  onScan: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const severityClass = {
  ok: "text-gray-500 dark:text-gray-400",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-red-600 dark:text-red-400",
} as const;

export const EmailInput: React.FC<EmailInputProps> = ({
  emailText,
  setEmailText,
  onScan,
  onReset,
  isLoading,
}) => {
  const meter = getLengthMeter(emailText);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor="email-content"
          className="block text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Paste email content
        </label>
        <span className={`text-xs tabular-nums ${severityClass[meter.severity]}`}>
          {meter.current.toLocaleString()} / {MAX_EMAIL_LENGTH.toLocaleString()}
        </span>
      </div>

      <textarea
        id="email-content"
        rows={10}
        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder="Paste the full content of the email here, including headers (From, Subject, Date) if available…"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        disabled={isLoading}
        maxLength={MAX_EMAIL_LENGTH}
        aria-describedby="email-meter"
      />

      <div className="flex justify-end gap-2">
        {emailText && !isLoading && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={onScan}
          disabled={isLoading || !emailText.trim()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Scanning…
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
              Scan Email
            </>
          )}
        </button>
      </div>
    </div>
  );
};
