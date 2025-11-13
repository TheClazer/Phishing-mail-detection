
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { EmailInput } from './components/EmailInput';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeEmailText, getDetailedAnalysis, checkWithGoogleSearch } from './services/geminiService';
import type { AnalysisResult } from './types';
import { Status } from './types';

const App: React.FC = () => {
  const [emailText, setEmailText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({ status: Status.IDLE });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleScan = useCallback(async () => {
    if (!emailText.trim()) {
      setAnalysisResult({ status: Status.ERROR, details: 'Email content cannot be empty.' });
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Performing initial scan...');
    setAnalysisResult({ status: Status.LOADING });

    try {
      const result = await analyzeEmailText(emailText);
      if (result.toLowerCase().includes('phishing')) {
        setAnalysisResult({ status: Status.PHISHING, basicAnalysis: 'This email shows signs of a phishing attempt.' });
      } else {
        setAnalysisResult({ status: Status.SAFE, basicAnalysis: 'This email appears to be safe.' });
      }
    } catch (error) {
      console.error('Error during basic analysis:', error);
      setAnalysisResult({ status: Status.ERROR, details: 'Failed to analyze email. Please try again.' });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [emailText]);

  const handleDetailedAnalysis = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Running in-depth analysis (this may take a moment)...');
    try {
      const details = await getDetailedAnalysis(emailText);
      setAnalysisResult(prev => ({ ...prev, detailedAnalysis: details }));
    } catch (error) {
      console.error('Error during detailed analysis:', error);
      setAnalysisResult(prev => ({ ...prev, details: (prev.details || '') + '\nFailed to get detailed analysis.' }));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [emailText]);

  const handleSearchGrounding = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Checking information with Google Search...');
    try {
      const { text, sources } = await checkWithGoogleSearch(emailText);
      setAnalysisResult(prev => ({ ...prev, searchAnalysis: text, sources: sources }));
    } catch (error) {
      console.error('Error during search grounding:', error);
      setAnalysisResult(prev => ({ ...prev, searchAnalysis: (prev.searchAnalysis || '') + '\nFailed to check with Google Search.' }));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [emailText]);

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <EmailInput
            emailText={emailText}
            setEmailText={setEmailText}
            onScan={handleScan}
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
          <p>&copy; {new Date().getFullYear()} Gemini Phishing Detector. Powered by Google Gemini.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
