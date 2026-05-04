import { Readability } from '@mozilla/readability';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'EXTRACT') {
    try {
      const selectors = ['header', 'footer', 'nav', '.cookie-banner', '[class*="modal"]', 'aside', 'script', 'style'];
      selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
      
      const article = new Readability(document.cloneNode(true)).parse();
      const text = article?.textContent || document.body.innerText;

      sendResponse({ 
        success: true, 
        data: { 
          title: document.title, 
          content: text.trim().substring(0, 12000) 
        } 
      });
    } catch (e) {
      sendResponse({ success: false, error: 'Extraction failed' });
    }
  }
});
