import { Readability } from '@mozilla/readability';

chrome.runtime.onMessage.addListener((message: { action: string }, _sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  if (message.action === 'EXTRACT_CONTENT') {
    try {
      // Clone the document to avoid modifying the live page
      const documentClone = document.cloneNode(true) as Document;
      const reader = new Readability(documentClone);
      const article = reader.parse();

      if (article) {
        sendResponse({
          success: true,
          data: {
            title: article.title,
            content: article.textContent,
            excerpt: article.excerpt,
            url: window.location.href
          }
        });
      } else {
        sendResponse({
          success: false,
          error: 'Could not parse article content'
        });
      }
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during extraction'
      });
    }
  }
  return true; // Keep the message channel open for async response
});

console.log('[tldr] Content script active');
