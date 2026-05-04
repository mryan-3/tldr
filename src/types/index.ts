import { z } from 'zod';

export const SummarySchema = z.object({
  summary: z.array(z.string()),
  keyInsights: z.array(z.string()),
  readingTime: z.string(),
});

export type SummaryData = z.infer<typeof SummarySchema>;

export interface ExtractionResponse {
  success: boolean;
  data?: {
    title: string;
    content: string;
    excerpt: string;
    url: string;
  };
  error?: string;
}

export interface PageContent {
  title: string;
  content: string;
  excerpt: string;
  url: string;
}
