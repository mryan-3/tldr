document.addEventListener('DOMContentLoaded', () => {
  const toggle = (id, show) => document.getElementById(id).classList.toggle('hidden', !show);

  const renderSummary = (data) => {
    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = data.summary.map(s => `<li>${s}</li>`).join('');
    document.getElementById('insights-list').innerHTML = data.keyInsights.map(s => `<li class="italic">${s}</li>`).join('');
    
    const wordCount = (data.summary.join(' ') + ' ' + data.keyInsights.join(' ')).split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent = `${wordCount} words`;
    
    toggle('loading-state', false);
    toggle('summary-state', true);
  };

  document.getElementById('settings-btn').onclick = () => chrome.runtime.openOptionsPage();

  document.getElementById('summarize-btn').onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    toggle('idle-state', false);
    toggle('loading-state', true);

    chrome.runtime.sendMessage({ action: 'SUMMARIZE', url: tab.url }, (res) => {
      if (res?.success) renderSummary(res.data);
      else {
        document.getElementById('error-msg').textContent = res?.error || 'Failed';
        toggle('loading-state', false);
        toggle('error-state', true);
      }
    });
  };

  document.getElementById('copy-btn').onclick = () => {
    const text = Array.from(document.querySelectorAll('li')).map(li => li.textContent).join('\n');
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  };

  document.getElementById('retry-btn').onclick = () => location.reload();

  document.getElementById('close-btn').onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.local.remove(tabs[0].url);
      location.reload();
    });
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.local.get(['apiKey', tabs[0].url], (res) => {
      if (!res.apiKey) toggle('api-hint', true);
      if (res[tabs[0].url]) renderSummary(res[tabs[0].url].data);
    });
  });
});
