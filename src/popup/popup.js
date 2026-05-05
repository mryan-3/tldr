document.addEventListener('DOMContentLoaded', () => {
  const toggle = (id, show) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  };

  const renderSummary = (data) => {
    if (!data) return;
    const summary = Array.isArray(data.summary) ? data.summary : (data.summary ? [data.summary] : []);
    const insights = Array.isArray(data.keyInsights) ? data.keyInsights : (data.keyInsights ? [data.keyInsights] : []);

    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = summary.map(s => `<li>${s}</li>`).join('');
    document.getElementById('insights-list').innerHTML = insights.map(s => `<li class="italic">${s}</li>`).join('');
    
    const wordCount = (summary.join(' ') + ' ' + insights.join(' ')).split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent = `${wordCount} words`;
    
    toggle('loading-state', false);
    toggle('summary-state', true);
    toggle('idle-state', false);
  };

  document.getElementById('settings-btn').onclick = () => chrome.runtime.openOptionsPage();

  document.getElementById('summarize-btn').onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    toggle('idle-state', false);
    toggle('loading-state', true);

    chrome.runtime.sendMessage({ action: 'SUMMARIZE', url: tab.url }, (res) => {
      if (res?.success) renderSummary(res.data);
      else {
        const errorEl = document.getElementById('error-msg');
        if (errorEl) errorEl.textContent = res?.error || 'Failed';
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
      const url = tabs[0].url;
      chrome.storage.local.remove(`summary_${url}`);
      location.reload();
    });
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    chrome.storage.local.get(['apiKey', `summary_${url}`], (res) => {
      if (!res.apiKey) toggle('api-hint', true);
      if (res[`summary_${url}`]) renderSummary(res[`summary_${url}`].data);
    });
  });
});
