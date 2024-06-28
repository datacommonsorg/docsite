/**
 * Custom tabs for REST (v1) API documentation pages.
 *
 * See api/rest/v1/rest_bulk_api_template.md for an example of where this code
 * is used.
 *
 * Based on https://www.w3schools.com/howto/howto_js_tabs.asp
 */

function openTab(evt, elementName) {
  // hide all tab content
  let tabContent = document.getElementsByClassName('api-tabcontent');
  for (const content of tabContent) {
    content.style.display = 'none';
  }

  // set all tabs to not active
  let tabLinks = document.getElementsByClassName('api-tablink');
  for (const link of tabLinks) {
    link.className = link.className.replace(' active', '');
  }

  // display target tab's content, set that tab to active
  document.getElementById(elementName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

/**
 * Opens "GET Request" tab by default
 */
document.getElementById('get-button').click();
