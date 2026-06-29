const API_BASE = 'http://127.0.0.1:8765';

const log = document.querySelector('#log');
const fields = {
  dateFolder: document.querySelector('#dateFolder'),
  videoFile: document.querySelector('#videoFile'),
  caption: document.querySelector('#caption'),
  publishId: document.querySelector('#publishId'),
  status: document.querySelector('#status'),
};

function writeLog(value) {
  log.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function setBusy(button, busy) {
  button.disabled = busy;
}

function updateFields(data) {
  if (data.date_folder) fields.dateFolder.textContent = data.date_folder;
  if (data.video) fields.videoFile.textContent = data.video;
  if (data.caption) fields.caption.textContent = data.caption;
  if (data.publish_id) fields.publishId.textContent = data.publish_id;
  if (data.status) fields.status.textContent = data.status;
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || JSON.stringify(data));
  return data;
}

document.querySelector('#connectBtn').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  setBusy(button, true);
  try {
    const data = await api('/api/auth-url');
    writeLog({ action: 'auth-url', state: data.state, scopes: data.scopes, url: data.url });
    window.open(data.url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    writeLog(`Local demo server is required at ${API_BASE}\n\n${error.message}`);
  } finally {
    setBusy(button, false);
  }
});

document.querySelector('#previewBtn').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  setBusy(button, true);
  try {
    const data = await api('/api/preview');
    updateFields(data);
    writeLog(data);
  } catch (error) {
    writeLog(`Local demo server is required at ${API_BASE}\n\n${error.message}`);
  } finally {
    setBusy(button, false);
  }
});

document.querySelector('#initBtn').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  setBusy(button, true);
  try {
    const data = await api('/api/sandbox-init', { method: 'POST' });
    updateFields(data);
    writeLog(data);
  } catch (error) {
    writeLog(error.message);
  } finally {
    setBusy(button, false);
  }
});

document.querySelector('#uploadBtn').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  setBusy(button, true);
  try {
    fields.status.textContent = 'Uploading...';
    writeLog('Uploading video chunks to TikTok sandbox. This may take a few minutes for large files.');
    const data = await api('/api/sandbox-upload', { method: 'POST' });
    updateFields(data);
    writeLog(data);
  } catch (error) {
    fields.status.textContent = 'Upload failed';
    writeLog(error.message);
  } finally {
    setBusy(button, false);
  }
});
