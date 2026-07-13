import { invoke } from '@tauri-apps/api/core';

const form = document.querySelector('#download-form');
const status = document.querySelector('#status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.querySelector('#video-url').value.trim();
  const outputDir = document.querySelector('#output-dir').value.trim();
  const format = document.querySelector('#format').value;

  status.textContent = 'Starting download…';

  try {
    const result = await invoke('download_video', {
      url,
      outputDir,
      format,
    });
    status.textContent = result.message || result;
  } catch (error) {
    status.textContent = `Download failed: ${error}`;
  }
});
