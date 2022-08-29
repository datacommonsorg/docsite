/**
 * Custom syntax highlighting for REST API request signatures, for use on
 * documentation pages.
 *
 * Highlights text with the class "api-signature"
 * Selects all instances of POST, GET, DELETE, PUT, PATCH, 'URL:', 'JSON
 * Data:' and 'Header:' and applies the "keyword" class to it. Selects all instances of
 * '[in|out]' and all words surrounded by {} and applies the "param" class to
 * it.
 *
 * Styles for "keyword" and "param" classes are in
 * /_sass/api_documentation.scss
 *
 * For an example on how this script is used, see /api/rest/rest_api_template.md
 */

function customRESTSyntaxHighlighting(className) {
  const keyword_regex = /(GET|POST|HEAD|DELETE|PUT|PATCH|URL:|JSON Data:|Header:)/g;
  const param_regex = /{\w+}/g;
  const in_out_regex = /\[in\|out\]/g;

  const collection = document.getElementsByClassName(className);
  for (const signature of collection) {
    let html = signature.innerHTML;
    html = html.replace(keyword_regex, '<span class="keyword">$&</span>');
    html = html.replace(param_regex, '<span class="param">$&</span>');
    html = html.replace(in_out_regex, '<span class="param">$&</span>');
    signature.innerHTML = html;
  }
}

customRESTSyntaxHighlighting('api-signature');
