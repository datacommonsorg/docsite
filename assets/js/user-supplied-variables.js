
(() => {
  const STORAGE_PREFIX = 'dyn_var_';
  const urlUpdateTimeouts = {};

  // 1. Sanitize helper
  function sanitizeValue(val) {
    if (val === undefined || val === null) return '';
    const str = String(val);
    const normalized = str.replace(/[\x00-\x1F\x7F\s]+/g, '');
    if (/^(javascript|data|vbscript):/i.test(normalized)) {
      return '';
    }
    return str;
  }

  // 2. Fetch all known dynamic variables across URL & LocalStorage
  function getAllCurrentVars() {
    const vars = {};

    // First: LocalStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          vars[key.slice(STORAGE_PREFIX.length)] = localStorage.getItem(key);
        }
      }
    } catch (e) {
      console.warn('Storage access restricted:', e);
    }

    // Second: URL parameters (override storage if present)
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (key.startsWith('var.')) {
        vars[key.slice(4)] = value;
      }
    });

    return vars;
  }

  // 3. Apply a variable to the DOM
  function applyVarToDOM(varName, cleanVal) {
    // Fill text placeholders
    document.querySelectorAll(`.dyn-var[data-var="${varName}"]`).forEach(el => {
      if (el.textContent !== cleanVal) {
        el.textContent = cleanVal;
      }
    });

    // Fill form inputs (skip active element to avoid caret jumping)
    document.querySelectorAll(`.dyn-input[data-var="${varName}"]`).forEach(el => {
      if (el !== document.activeElement && el.value !== cleanVal) {
        el.value = cleanVal;
      }
    });
  }

  // 4. Update internal links so navigating carries parameters automatically
  function syncInternalLinks() {
    const currentVars = getAllCurrentVars();
    const activeKeys = Object.keys(currentVars);
    if (activeKeys.length === 0) return;

    document.querySelectorAll('a[href]').forEach(link => {
      const rawHref = link.getAttribute('href');
      // Skip anchors, mailto, javascript, external links
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('javascript:')) {
        return;
      }

      try {
        const targetUrl = new URL(link.href, window.location.origin);
        // Only modify links pointing to the same website
        if (targetUrl.origin === window.location.origin) {
          activeKeys.forEach(k => {
            if (currentVars[k]) {
              targetUrl.searchParams.set(`var.${k}`, currentVars[k]);
            }
          });
          link.href = targetUrl.toString();
        }
      } catch (err) {
        // Ignore unparseable URLs
      }
    });
  }

  // 5. Update state and trigger sync
  function updateDynamicVar(varName, value, syncUrl = true) {
    if (!varName || !/^[a-zA-Z0-9_-]+$/.test(varName)) return;
    const cleanVal = sanitizeValue(value);

    // DOM
    applyVarToDOM(varName, cleanVal);

    // LocalStorage
    try {
      const key = `${STORAGE_PREFIX}${varName}`;
      if (cleanVal.trim() !== '') {
        localStorage.setItem(key, cleanVal);
      } else {
        localStorage.removeItem(key);
      }
    } catch (e) {}

    // Update Links
    syncInternalLinks();

    // Debounced URL updates for current tab
    if (syncUrl) {
      clearTimeout(urlUpdateTimeouts[varName]);
      urlUpdateTimeouts[varName] = setTimeout(() => {
        const url = new URL(window.location);
        const paramKey = `var.${varName}`;
        if (cleanVal.trim() !== '') {
          url.searchParams.set(paramKey, cleanVal);
        } else {
          url.searchParams.delete(paramKey);
        }
        window.history.replaceState({}, '', url);
      }, 300);
    }
  }

  // 6. Hydrate the page
  function hydrate() {
    const allVars = getAllCurrentVars();
    Object.entries(allVars).forEach(([varName, val]) => {
      applyVarToDOM(varName, sanitizeValue(val));
    });
    syncInternalLinks();
    bindInputs();
  }

  // 7. Bind input events safely (idempotent)
  function bindInputs() {
    document.querySelectorAll('.dyn-input').forEach(input => {
      if (input.dataset.dynBound === 'true') return;
      input.dataset.dynBound = 'true';

      const varName = input.getAttribute('data-var');
      if (varName) {
        input.addEventListener('input', (e) => {
          updateDynamicVar(varName, e.target.value, true);
        });
      }
    });
  }

  // Run on start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }

  // Catch dynamic content or late-rendered templates
  const observer = new MutationObserver(() => {
    hydrate();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Sync across open browser tabs
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
      const varName = e.key.slice(STORAGE_PREFIX.length);
      applyVarToDOM(varName, sanitizeValue(e.newValue || ''));
    }
  });
})();