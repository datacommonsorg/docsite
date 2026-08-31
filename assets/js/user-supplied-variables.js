



  // Function to update all placeholders for a specific variable
function updateDynamicVar(varName, value) {
  // Update all text placeholders
  document.querySelectorAll(`.dyn-var[data-var="${varName}"]`).forEach(el => {
    el.textContent = value;
  });

  // Update input fields to match (if they aren't the one being typed in)
  document.querySelectorAll(`.dyn-input[data-var="${varName}"]`).forEach(el => {
    if (el.value !== value) {
      el.value = value;
    }
  });

  // Update URL parameters to allow sharing
  const url = new URL(window.location);
  url.searchParams.set(`var.${varName}`, value);
  window.history.replaceState({}, '', url);
}

// On page load, scan for URL parameters and apply them
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    if (key.startsWith('var.')) {
      const varName = key.substring(4);
      updateDynamicVar(varName, value);
    }
  });

  // Attach event listeners to input fields
  document.querySelectorAll('.dyn-input').forEach(input => {
    const varName = input.getAttribute('data-var');
    input.addEventListener('input', (e) => {
      updateDynamicVar(varName, e.target.value);
    });
  });
});