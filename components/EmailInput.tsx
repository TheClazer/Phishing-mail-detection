
import React from 'react';
import { SparklesIcon, LoaderIcon } from './icons';

interface EmailInputProps {
  emailText: string;
  setEmailText: (text: string) => void;
  onScan: () => void;
  isLoading: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ emailText, setEmailText, onScan, isLoading }) => {
  return (
    <div className="space-y-4">
      <label htmlFor="email-content" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
        Paste Email Content
      </label>
      <textarea
        id="email-content"
        rows={10}
        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder="Paste the full content of the email here..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <button
          onClick={onScan}
          disabled={isLoading || !emailText.trim()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Scanning...
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
