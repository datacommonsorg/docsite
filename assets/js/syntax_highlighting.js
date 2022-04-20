/*
<<<<<<< HEAD
Custom syntax highlighting for REST API request signatures, for use on documentation pages.
=======
Custom syntax highlighting for REST api request signatures, for use on documentation pages.
>>>>>>> e6efe44ea7ee438a8cfb52749789d4bb75531ae7

Highlights text with the id "api-signature"
Selects all instances of POST, GET, DELETE, PUT, PATCH and applies the "keyword" class to it
Selects all instances of words surrounded by {} and applies the "param" class to it
<<<<<<< HEAD
Styles for "keyword" and "param" classes are in /_sass/api_documentation.scss

For an example on how this script is used, see /api/rest/rest_api_template.md
*/

function customRESTSyntaxHighlighting(id) {
  var signature = document.getElementById(id);
  var html = signature.innerHTML;
  var keyword_regex = /(GET|POST|HEAD|DELETE|PUT|PATCH)/g;
  var param_regex = /{[A-Za-z0-9]+}/g;

  html = html.replace(keyword_regex, '<span class="keyword">$&</span>');
  html = html.replace(param_regex, '<span class="param">$&</span>');

  signature.innerHTML = html;
}

customRESTSyntaxHighlighting("api-signature");
=======

For an example on how this is used, see /api/rest/rest_api_template.md
*/

function customRESTSyntaxHighlighting(id) {
    var signature = document.getElementById(id)
    var html = signature.innerHTML;
    var keyword_regex = /(GET|POST|HEAD|DELETE|PUT|PATCH)/g;
    var param_regex = /{[A-Za-z0-9]+}/g;
    
    html = html.replace(keyword_regex, '<span class="keyword">$&</span>');
    html = html.replace(param_regex, '<span class="param">$&</span>');
    
    signature.innerHTML = html;
}

customRESTSyntaxHighlighting("api-signature")
>>>>>>> e6efe44ea7ee438a8cfb52749789d4bb75531ae7
