document.addEventListener('DOMContentLoaded', () => {
      // Input sanitization: strips HTML delimiters and control characters
      function sanitize(str) {
        if (!str) return '';
        return str
          .replace(/[<>"'`]/g, '')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .trim();
      }

      // Store initial fallback text for each placeholder
      const fallbacks = new Map();
      document.querySelectorAll('[data-var]').forEach(el => {
        const key = el.dataset.var;
        if (!fallbacks.has(key)) {
          fallbacks.set(key, el.textContent);
        }
      });

      // Listen for typing in any input field with data-bind="..."
      document.querySelectorAll('input[data-bind]').forEach(input => {
        const varName = input.dataset.bind;

        input.addEventListener('input', () => {
          const cleanedValue = sanitize(input.value);
          const targets = document.querySelectorAll(`[data-var="${varName}"]`);

          targets.forEach(target => {
            // textContent prevents any code or HTML execution
            target.textContent = cleanedValue || fallbacks.get(varName) || '';
          });
        });
      });
    });