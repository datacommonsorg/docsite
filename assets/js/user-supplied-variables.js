const urlUpdateTimeouts = {};

/**
 * Basic value sanitizer:
 * - Coerces to string
 * - Blocks dangerous URL schemes (e.g. javascript:)
 * - Encodes HTML special characters to prevent HTML/XSS injection
 */
function sanitizeValue(val) {
  if (val === undefined || val === null) return '';
  const str = String(val);

  // Block javascript: or data: URI schemes
  if (/^\s*(javascript|data|vbscript):/i.test(str)) {
    return '';
  }

// Function to update all placeholders for a specific variable
function updateDynamicVar(varName, value, syncUrl = true) {
  if (!varName || !/^[a-zA-Z0-9_-]+$/.test(varName)) {
    return;
  }

  const cleanValue = sanitizeValue(value);

  // Update all text placeholders
  document.querySelectorAll(`.dyn-var[data-var="${varName}"]`).forEach(el => {
    el.textContent = cleanValue;
  });

  // Update input fields to match
  document.querySelectorAll(`.dyn-input[data-var="${varName}"]`).forEach(el => {
    if (el.value !== cleanValue) {
      el.value = cleanValue;
    }
  });

  // Debounce URL parameter updates
  if (syncUrl) {
    clearTimeout(urlUpdateTimeouts[varName]);
    urlUpdateTimeouts[varName] = setTimeout(() => {
      const url = new URL(window.location);
      const paramKey = `var.${varName}`;

      if (cleanValue.trim() !== '') {
        url.searchParams.set(paramKey, cleanValue);
      } else {
        url.searchParams.delete(paramKey);
      }

      window.history.replaceState({}, '', url);
    }, 500);
  }
}

// On page load, scan for URL parameters and apply them
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    if (key.startsWith('var.')) {
      const varName = key.substring(4);
      updateDynamicVar(varName, value, false);
    }
  });

  // Attach event listeners to input fields
  document.querySelectorAll('.dyn-input').forEach(input => {
    const varName = input.getAttribute('data-var');
    input.addEventListener('input', (e) => {
      updateDynamicVar(varName, e.target.value, true);
    });
  });
});
