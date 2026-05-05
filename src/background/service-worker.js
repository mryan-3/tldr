import { GoogleGenerativeAI } from '@google/generative-ai';

const TIMEOUT_MS = 60000;
const CACHE_TTL = 24 * 60 * 60 * 1000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SUMMARIZE') {
    handleRequest(message.url, sendResponse);
    return true;
  }
});

async function handleRequest(url, sendResponse) {
  const cached = await chrome.storage.local.get(`summary_${url}`);
  if (cached[`summary_${url}`] && (Date.now() - cached[`summary_${url}`].timestamp < CACHE_TTL)) {
    return sendResponse({ success: true, data: cached[`summary_${url}`].data });
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT' }, async (ext) => {
    if (!ext?.success) return sendResponse({ success: false, error: ext?.error });

    try {
      const { apiKey } = await chrome.storage.local.get('apiKey');
      if (!apiKey) throw new Error('API Key missing');

      const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const prompt = `Summarize the following content in JSON format.
      Schema: {
        "summary": ["string"],
        "keyInsights": ["string"],
        "readingTime": "string"
      }
      Important: "summary" and "keyInsights" MUST be arrays of strings.
      Article: ${ext.data.content}`;
      
      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format error');
      
      const data = JSON.parse(jsonMatch[0]);
      chrome.storage.local.set({ [`summary_${url}`]: { data, timestamp: Date.now() } });
      sendResponse({ success: true, data });
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
  });
}
