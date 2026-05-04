const toggle = (id, show) => document.getElementById(id).classList.toggle('hidden', !show);

document.getElementById('summarize-btn').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  toggle('idle-state', false);
  toggle('loading-state', true);

  chrome.runtime.sendMessage({ action: 'SUMMARIZE', url: tab.url }, (res) => {
    if (res?.success) {
      document.getElementById('reading-time').textContent = res.data.readingTime;
      document.getElementById('summary-list').innerHTML = res.data.summary.map(s => `<li>${s}</li>`).join('');
      document.getElementById('insights-list').innerHTML = res.data.keyInsights.map(s => `<li class="italic">${s}</li>`).join('');
      toggle('loading-state', false);
      toggle('summary-state', true);
    } else {
      document.getElementById('error-msg').textContent = res?.error || 'Failed';
      toggle('loading-state', false);
      toggle('error-state', true);
    }
  });
};
