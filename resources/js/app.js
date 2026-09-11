import { formatJson, minifyJson, parseJson } from './json-utility.js';

const input = document.querySelector('#json-input');
const output = document.querySelector('#json-output');
const inputMeta = document.querySelector('#input-meta');
const outputStatus = document.querySelector('#output-status');
const statusMessage = document.querySelector('#status-message');
const indentSelect = document.querySelector('#indent-size');
const formatButton = document.querySelector('#format-json');
const minifyButton = document.querySelector('#minify-json');
const validateButton = document.querySelector('#validate-json');
const copyButton = document.querySelector('#copy-output');
const clearButton = document.querySelector('#clear-json');
const exampleButton = document.querySelector('#load-example');

const MAX_INPUT_CHARS = 5_000_000;

const exampleJson = `{
  "project": {
    "name": "JSON Formatter",
    "version": "1.0.0",
    "private": true,
    "tags": ["developer-tool", "json", "utility"]
  },
  "owner": {
    "name": "Alex Morgan",
    "contact": {
      "email": "alex@example.com",
      "website": "https://example.com"
    }
  },
  "settings": {
    "theme": "dark",
    "autosave": false,
    "notifications": null
  },
  "stats": {
    "users": 1248,
    "active": true,
    "rating": 4.8
  }
}`;

function getIndent() {
    return indentSelect.value === 'tab' ? '\t' : Number(indentSelect.value);
}

function setStatus(label, type = 'idle', message = '') {
    outputStatus.textContent = label;
    outputStatus.className = `status-pill status-${type}`;
    statusMessage.textContent = message;
    statusMessage.className = `order-2 min-h-5 px-1 text-xs ${type === 'invalid' ? 'text-rose-300' : type === 'valid' ? 'text-emerald-300' : 'text-zinc-500'} lg:order-1`;
}

function updateButtons() {
    const hasInput = input.value.trim().length > 0;
    const hasOutput = output.value.length > 0;
    const inputTooLarge = input.value.length > MAX_INPUT_CHARS;

    if (inputTooLarge) {
        formatButton.disabled = true;
        minifyButton.disabled = true;
        validateButton.disabled = true;
        clearButton.disabled = false;
        copyButton.disabled = !hasOutput;
        inputMeta.textContent = `${input.value.length.toLocaleString()} chars`;
        return;
    }

    formatButton.disabled = !hasInput;
    minifyButton.disabled = !hasInput;
    validateButton.disabled = !hasInput;
    clearButton.disabled = !hasInput && !hasOutput;
    copyButton.disabled = !hasOutput;

    inputMeta.textContent = `${input.value.length.toLocaleString()} chars`;
}

function checkInputSize() {
    if (input.value.length <= MAX_INPUT_CHARS) {
        return true;
    }

    setStatus('Too large', 'working', 'This browser-only utility accepts up to 5,000,000 characters to keep the page responsive.');
    updateButtons();
    return false;
}

function describeError(parsed) {
    const error = parsed.error;

    if (!error) {
        return 'Invalid JSON.';
    }

    if (error.line && error.column) {
        return `${error.message} — around line ${error.line}, column ${error.column}.`;
    }

    return error.message;
}

function validateInput({ updateOutput = false } = {}) {
    if (!checkInputSize()) {
        return false;
    }

    const value = input.value.trim();

    if (!value) {
        setStatus('Ready', 'idle', 'Paste JSON to get started.');
        return false;
    }

    const parsed = parseJson(value);

    if (parsed.valid) {
        setStatus('Valid JSON', 'valid', 'The input is valid JSON.');

        if (updateOutput) {
            output.value = JSON.stringify(parsed.value, null, getIndent());
        }

        updateButtons();
        return true;
    }

    outputStatus.textContent = 'Invalid JSON';
    outputStatus.className = 'status-pill status-invalid';
    statusMessage.textContent = describeError(parsed);
    statusMessage.className = 'order-2 min-h-5 px-1 text-xs text-rose-300 lg:order-1';

    if (updateOutput) {
        output.value = '';
    }

    updateButtons();
    return false;
}

function performTransform(transform, label) {
    if (!checkInputSize()) {
        return;
    }

    const value = input.value.trim();

    if (!value) {
        updateButtons();
        return;
    }

    try {
        output.value = transform(value);
        setStatus('Valid JSON', 'valid', label);
        updateButtons();
        output.focus();
        output.setSelectionRange(0, 0);
    } catch (error) {
        validateInput({ updateOutput: true });
    }
}

input.addEventListener('input', () => {
    output.value = '';

    if (input.value.length > MAX_INPUT_CHARS) {
        setStatus('Too large', 'working', 'This browser-only utility accepts up to 5,000,000 characters to keep the page responsive.');
    } else {
        setStatus('Ready', 'idle', input.value.trim() ? 'Choose an action to process your JSON.' : 'Paste JSON to get started.');
    }

    updateButtons();
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.setRangeText('\t', start, end, 'end');
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        performTransform((value) => formatJson(value, getIndent()), 'Formatted successfully.');
    }
});

formatButton.addEventListener('click', () => {
    performTransform((value) => formatJson(value, getIndent()), 'Formatted successfully.');
});

minifyButton.addEventListener('click', () => {
    performTransform(minifyJson, 'Minified successfully.');
});

validateButton.addEventListener('click', () => {
    validateInput();
});

indentSelect.addEventListener('change', () => {
    if (output.value) {
        performTransform((value) => formatJson(value, getIndent()), 'Reformatted with the selected indentation.');
    }
});

copyButton.addEventListener('click', async () => {
    if (!output.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(output.value);
    } catch {
        output.focus();
        output.select();
        document.execCommand('copy');
        output.setSelectionRange(0, 0);
    }

    const previousLabel = copyButton.innerHTML;
    copyButton.innerHTML = '<span>Copied!</span>';
    window.setTimeout(() => {
        copyButton.innerHTML = previousLabel;
    }, 1400);
});

clearButton.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    input.focus();
    setStatus('Ready', 'idle', 'Paste JSON to get started.');
    updateButtons();
});

exampleButton.addEventListener('click', () => {
    input.value = exampleJson;
    output.value = '';
    indentSelect.value = '2';
    input.focus();
    updateButtons();
    setStatus('Ready', 'idle', 'Example loaded. Press Format or Ctrl/Cmd + Enter.');
});

updateButtons();
