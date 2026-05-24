import React from "react";

import { renderMarkdownSafe } from "../lib/markdown";
import { Status, type AnalysisResult } from "../types";

import {
  BrainIcon,
  GoogleIcon,
  InformationCircleIcon,
  LoaderIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "./icons";

interface ResultDisplayProps {
  result: AnalysisResult;
  isLoading: boolean;
  loadingMessage: string;
  onDetailedAnalysis: () => void;
  onSearchGrounding: () => void;
}

const statusConfig = {
  [Status.SAFE]: {
    bgColor: "bg-green-100 dark:bg-green-900/50",
    borderColor: "border-green-400 dark:border-green-600",
    textColor: "text-green-800 dark:text-green-200",
    icon: <ShieldCheckIcon className="h-6 w-6 text-green-500" />,
    title: "Safe",
  },
  [Status.PHISHING]: {
    bgColor: "bg-red-100 dark:bg-red-900/50",
    borderColor: "border-red-400 dark:border-red-600",
    textColor: "text-red-800 dark:text-red-200",
    icon: <ShieldExclamationIcon className="h-6 w-6 text-red-500" />,
    title: "Potential Phishing",
  },
  [Status.UNCLEAR]: {
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    borderColor: "border-blue-400 dark:border-blue-600",
    textColor: "text-blue-800 dark:text-blue-200",
    icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    title: "Unclear",
  },
  [Status.ERROR]: {
    bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    borderColor: "border-yellow-400 dark:border-yellow-600",
    textColor: "text-yellow-800 dark:text-yellow-200",
    icon: <InformationCircleIcon className="h-6 w-6 text-yellow-500" />,
    title: "Couldn't analyze",
  },
} as const;

type StatusWithConfig = keyof typeof statusConfig;

const ResultCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({
  title,
  children,
  icon,
}) => (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
    <h3 className="text-lg font-semibold flex items-center mb-2 text-gray-800 dark:text-gray-200">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
      {children}
    </div>
  </div>
);

const SafeMarkdown: React.FC<{ source: string }> = ({ source }) => (
  // eslint-disable-next-line react/no-danger -- source is sanitized via DOMPurify in renderMarkdownSafe
  <div dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(source) }} />
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading,
  loadingMessage,
  onDetailedAnalysis,
  onSearchGrounding,
}) => {
  if (isLoading && result.status === Status.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
        <LoaderIcon className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg font-medium">{loadingMessage || "Analyzing…"}</p>
      </div>
    );
  }

  if (result.status === Status.IDLE) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Your analysis results will appear here.</p>
      </div>
    );
  }

  const config =
    result.status in statusConfig ? statusConfig[result.status as StatusWithConfig] : undefined;

  const canDeepen = result.status === Status.PHISHING || result.status === Status.SAFE || result.status === Status.UNCLEAR;

  return (
    <div className="space-y-6">
      {config && (
        <div className={`border-l-4 p-4 rounded-r-lg ${config.bgColor} ${config.borderColor}`}>
          <div className="flex">
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-bold ${config.textColor}`}>{config.title}</p>
              <p className={`text-sm ${config.textColor} mt-1`}>
                {result.status === Status.ERROR ? result.details : result.basicAnalysis}
              </p>
              {result.status === Status.ERROR && result.hint && (
                <p className={`text-xs ${config.textColor} mt-2 opacity-80`}>{result.hint}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {canDeepen && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onDetailedAnalysis}
            disabled={isLoading || Boolean(result.detailedAnalysis)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && loadingMessage.includes("in-depth") ? (
              <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <BrainIcon className="mr-2 h-4 w-4" />
            )}
            In-depth Analysis
          </button>
          <button
            type="button"
            onClick={onSearchGrounding}
            disabled={isLoading || Boolean(result.searchAnalysis)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && loadingMessage.includes("Google") ? (
              <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Check with Google
          </button>
        </div>
      )}

      {result.detailedAnalysis && (
        <ResultCard title="Detailed Analysis" icon={<BrainIcon className="h-5 w-5 text-indigo-500" />}>
          <SafeMarkdown source={result.detailedAnalysis} />
        </ResultCard>
      )}

      {result.searchAnalysis && (
        <ResultCard
          title="Google Search Grounding"
          icon={<GoogleIcon className="h-5 w-5 text-blue-500" />}
        >
          <SafeMarkdown source={result.searchAnalysis} />
          {result.sources && result.sources.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm">Sources:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {result.sources.map((source, index) => (
                  <li key={`${source.uri}-${index}`}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
};
