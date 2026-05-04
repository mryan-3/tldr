console.log('[tldr] Background worker initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('[tldr] Extension installed');
});

export {};
