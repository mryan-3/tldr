import { GoogleGenerativeAI } from '@google/generative-ai';
import { PageContent, SummaryData } from '../types';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'SUMMARIZE_CONTENT') {
    handleSummarization(message.payload, sendResponse);
    return true; // Keep channel open
  }
});

async function handleSummarization(payload: PageContent, sendResponse: (response: any) => void) {
  try {
    const { apiKey } = await chrome.storage.local.get('apiKey');
    
    if (!apiKey) {
      sendResponse({ success: false, error: 'API Key missing. Please set it in the extension options.' });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Summarize the following article content. 
      Provide the output in JSON format with the following structure:
      {
        "summary": ["bullet point 1", "bullet point 2", ...],
        "keyInsights": ["insight 1", "insight 2", ...],
        "readingTime": "X min read"
      }
      
      Article Title: ${payload.title}
      Content: ${payload.content.substring(0, 15000)} 
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown code blocks from JSON response
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const summaryData: SummaryData = JSON.parse(cleanedJson);

    sendResponse({ success: true, data: summaryData });
  } catch (error) {
    console.error('[tldr] Summarization error:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate summary' 
    });
  }
}
