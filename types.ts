import type { GroundingSource } from "./services/geminiService";

export enum Status {
  IDLE = "idle",
  LOADING = "loading",
  SAFE = "safe",
  PHISHING = "phishing",
  UNCLEAR = "unclear",
  ERROR = "error",
}

export interface AnalysisResult {
  status: Status;
  basicAnalysis?: string;
  detailedAnalysis?: string;
  searchAnalysis?: string;
  details?: string; // human-readable error message
  hint?: string; // optional fix-it suggestion for error status
  sources?: GroundingSource[];
}
