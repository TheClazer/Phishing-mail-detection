import React, { useCallback, useState } from "react";

import { EmailInput } from "./components/EmailInput";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { ResultDisplay } from "./components/ResultDisplay";
import { SampleEmails } from "./components/SampleEmails";
import { AnalysisError } from "./lib/errors";
import { validateEmailText } from "./lib/validation";
import {
  analyzeEmailText,
  checkWithGoogleSearch,
  getDetailedAnalysis,
} from "./services/geminiService";
import { Status, type AnalysisResult } from "./types";

const App: React.FC = () => {
  const [emailText, setEmailText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({ status: Status.IDLE });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const setError = useCallback((err: unknown): void => {
    if (err instanceof AnalysisError) {
      setAnalysisResult({ status: Status.ERROR, details: err.message, hint: err.hint });
    } else {
      setAnalysisResult({
        status: Status.ERROR,
        details: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  }, []);

  const handleScan = useCallback(async (): Promise<void> => {
    const validation = validateEmailText(emailText);
    if (!validation.ok) {
      setAnalysisResult({ status: Status.ERROR, details: validation.reason });
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Performing initial scan…");
    setAnalysisResult({ status: Status.LOADING });

    try {
      const verdict = await analyzeEmailText(emailText);
      if (verdict === "phishing") {
        setAnalysisResult({
          status: Status.PHISHING,
          basicAnalysis: "This email shows signs of a phishing attempt.",
        });
      } else if (verdict === "safe") {
        setAnalysisResult({
          status: Status.SAFE,
          basicAnalysis: "This email appears to be safe.",
        });
      } else {
        setAnalysisResult({
          status: Status.UNCLEAR,
          basicAnalysis:
            "Couldn't confidently classify this email. Try an in-depth analysis below.",
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [emailText, setError]);

  const handleDetailedAnalysis = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadingMessage("Running in-depth analysis (this may take a moment)…");
    try {
      const details = await getDetailedAnalysis(emailText);
      setAnalysisResult((prev) => ({ ...prev, detailedAnalysis: details }));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [emailText, setError]);

  const handleSearchGrounding = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadingMessage("Checking with Google Search…");
    try {
      const { text, sources } = await checkWithGoogleSearch(emailText);
      setAnalysisResult((prev) => ({ ...prev, searchAnalysis: text, sources }));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [emailText, setError]);

  const handleSelectSample = useCallback((body: string): void => {
    setEmailText(body);
    setAnalysisResult({ status: Status.IDLE });
  }, []);

  const handleReset = useCallback((): void => {
    setEmailText("");
    setAnalysisResult({ status: Status.IDLE });
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
        <Header />
        <main className="container mx-auto p-4 md:p-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <SampleEmails onSelect={handleSelectSample} disabled={isLoading} />
            <EmailInput
              emailText={emailText}
              setEmailText={setEmailText}
              onScan={handleScan}
              onReset={handleReset}
              isLoading={isLoading}
            />
            <ResultDisplay
              result={analysisResult}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              onDetailedAnalysis={handleDetailedAnalysis}
              onSearchGrounding={handleSearchGrounding}
            />
          </div>
          <footer className="text-center text-sm text-gray-500 mt-8">
            <p>
              Phishing-mail-detection · Powered by Google Gemini ·{" "}
              <a
                href="https://github.com/TheClazer/Phishing-mail-detection"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Source on GitHub
              </a>
            </p>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
