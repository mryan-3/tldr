export interface PageContent {
  title: string;
  content: string;
  excerpt: string;
  url: string;
}

export interface ExtractionResponse {
  success: boolean;
  data?: PageContent;
  error?: string;
}

export interface SummaryData {
  summary: string[];
  keyInsights: string[];
  readingTime: string;
}
