
export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SAFE = 'safe',
  PHISHING = 'phishing',
  ERROR = 'error',
}

export interface AnalysisResult {
  status: Status;
  basicAnalysis?: string;
  detailedAnalysis?: string;
  searchAnalysis?: string;
  details?: string; // For error messages
  sources?: any[];
}
