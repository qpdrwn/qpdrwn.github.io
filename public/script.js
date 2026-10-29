'use strict';

const form = document.querySelector('.brief-form');
const statusBox = document.querySelector('#form-status');
const submitButton = form?.querySelector('.submit-button');
const submitLabel = submitButton?.querySelector('span:first-child');
const fileInput = document.querySelector('#file');
const fileName = document.querySelector('#file-name');
const messageInput = document.querySelector('#message');
const messageCount = document.querySelector('#message-count');
const year = document.querySelector('#year');

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = '10 MB';
const DEFAULT_BUTTON_LABEL = 'Send project brief';

const ALLOWED_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'pdf', 'svg', 'ai', 'psd'
];

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function showStatus(message, type) {
  if (!statusBox) return;

  statusBox.textContent = message;
  statusBox.className = `form-status is-visible is-${type}`;
}

function clearStatus() {
  if (!statusBox) return;

  statusBox.textContent = '';
  statusBox.className = 'form-status';
}

function validateFile(file) {
  if (!file) return null;

  if (file.size > MAX_FILE_SIZE) {
    return `That file is larger than ${MAX_FILE_SIZE_LABEL}. Please choose a smaller file.`;
  }

  const extension = file.name.split('.').pop().toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return 'This file type is not supported. Please choose JPG, PNG, PDF, SVG, AI, or PSD.';
  }

  return null;
}

function resetFileLabel() {
  if (fileName) {
    fileName.textContent = 'Choose a file to attach';
  }
}

function updateMessageCount() {
  if (!messageInput || !messageCount) return;

  messageCount.textContent = `${messageInput.value.length} / 3000`;
}

if (fileInput) {
  fileInput.addEventListener('change', () => {
    clearStatus();

    const file = fileInput.files?.[0];

    if (fileName) {
      fileName.textContent = file
        ? file.name
        : 'Choose a file to attach';
    }

    const error = validateFile(file);

    if (error) {
      fileInput.value = '';
      resetFileLabel();
      showStatus(error, 'error');
    }
  });
}

if (messageInput) {
  messageInput.addEventListener('input', updateMessageCount);
  updateMessageCount();
}

if (form && submitButton && submitLabel) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    if (!form.reportValidity()) return;

    const attachment = fileInput?.files?.[0];
    const fileError = validateFile(attachment);

    if (fileError) {
      showStatus(fileError, 'error');
      return;
    }

    const originalLabel = submitLabel.textContent || DEFAULT_BUTTON_LABEL;

    submitButton.disabled = true;
    submitLabel.textContent = 'Sending brief…';
    submitButton.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          'The server returned an unexpected response. Please check your Worker configuration.'
        );
      }

      // The Worker returns success: true on success.
      // Accept ok: true as well for compatibility with older versions.
      const succeeded = result.success === true || result.ok === true;

      if (!response.ok || !succeeded) {
        throw new Error(
          result.error ||
          'Your brief could not be sent. Please try again.'
        );
      }

      form.reset();
      resetFileLabel();
      updateMessageCount();

      showStatus(
        result.message ||
        'Thanks — your project brief has been sent. We’ll be in touch soon.',
        'success'
      );
    } catch (error) {
      let message =
        'Something went wrong. Please check your connection and try again.';

      if (error instanceof TypeError) {
        message =
          'Could not connect to the server. Please check the Worker URL and CORS settings.';
      } else if (error instanceof Error) {
        message = error.message;
      }

      showStatus(message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitLabel.textContent = originalLabel;
    }
  });
}
